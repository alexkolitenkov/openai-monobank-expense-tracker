import { DateTime }       from 'luxon';
import UseCaseBase        from '../../Base.js';
import { ApiClient }      from '../../../infrastructure/api-client/ApiClient.js';
import config             from '../../../config.cjs';
import Transaction        from '../../../domain-model/Transaction.js';
import Token              from '../../../domain-model/Token.js';
import { MCC_CATEGORIES } from '../../../../constants/mccCategories.js';

const { ACCRUAL, WITHDRAWAL } = Transaction.TYPES;

export class List extends UseCaseBase {
    async validate(payload = {}) {
        if (!this.#validateYearMonth(payload.year, payload.month)) {
            throw new Error('Invalid year or month');
        }

        return this.doValidation(payload, {
            accountId : [ 'required', 'string', { max_length: 255 } ],
            year      : [ 'required', 'string', { max_length: 4 } ],
            month     : [ 'required', 'string', { one_of: Array.from({ length: 12 }, (_, i) => String(i + 1)) } ],
            grouped   : [ { one_of: [ 0, 1 ] }, { default: 0 } ]
        });
    }

    async execute({ year, month, accountId, grouped }) {
        // Count the transactions in DB for the given year and month
        const count = await this.#countTransactionsByYearAndMonth(year, month, accountId);

        // If there are no transactions for the given month/year, fetch all from Monobank
        if (!count) {
            await this.#fetchFromMonobank({ year, month, accountId });
        } else {
            // If it's the current month, fetch only new transactions (diffs)
            const isCurrentMonth = this.#isCurrentMonth(year, month);

            if (isCurrentMonth) {
                await this.#fetchDiffFromMonobank({ year, month, accountId });
            }
        }

        if (grouped) {
            return this.#listTransactionsGrouped({ year, month, accountId });
        }

        return this.#listTransactions({ year, month, accountId });
    }

    #isCurrentMonth(year, month) {
        const currentYear = String(new Date().getFullYear());
        const currentMonth = String(new Date().getMonth() + 1);

        return year === currentYear && month === currentMonth;
    }

    async #fetchDiffFromMonobank({ year, month, accountId }) {
        const from = DateTime.fromObject({ year, month, day: 1 }).startOf('month').toUnixInteger();
        const to = DateTime.fromObject({ year, month, day: 1 }).endOf('month').toUnixInteger();

        // Fetch existing transactions from DB for the given month
        const existingTransactions = await this.#fetchTransactions(year, month, accountId);
        const existingTransactionIds = new Set(existingTransactions.map(tx => tx.transactionId));

        // Fetch new transactions from Monobank API
        const token = await Token.scope([ { method: [ 'userId', this.context.userId ] } ]).findOne();

        if (!token) throw new Error('Token not found for user');

        const ApiClientInstance = new ApiClient({ baseUrl: config.bankStatementUrl });

        try {
            const res = await ApiClientInstance.get(`${accountId}/${from}/${to}`, null, { 'X-Token': token.value });

            if (!res && !res.data || res.status === 400) return [];

            // Filter out transactions that are already in the DB
            const newTransactionsArray = res.data.filter(tx => !existingTransactionIds.has(tx.id)).map(tx => ({
                ...tx,
                accountId,
                time          : new Date(tx.time * 1000),
                userId        : this.context.userId,
                type          : tx.amount > 0 ? ACCRUAL : WITHDRAWAL,
                transactionId : tx.id
            }));

            // Insert only the new transactions into the DB
            if (newTransactionsArray.length > 0) {
                await Transaction.bulkCreateConsecutive(newTransactionsArray);
            }
        } catch (error) {
            console.error('Error fetching transactions from Monobank: ', error);
            throw error;
        }
    }

    #countTransactionsByYearAndMonth(year, month, accountId) {
        return Transaction.scope([
            { method: [ 'time', year, month ] },
            { method: [ 'accountId', accountId ] }
        ]).count();
    }

    async #fetchFromMonobank({ year, month, accountId }) {
        const from = DateTime.fromObject({ year, month, day: 1 }).startOf('month').toUnixInteger();
        const to = DateTime.fromObject({ year, month, day: 1 }).endOf('month').toUnixInteger();

        const token = await Token.scope([ { method: [ 'userId', this.context.userId ] } ]).findOne();

        if (!token) throw new Error('Token not found for user');

        const ApiClientInstance = new ApiClient({ baseUrl: config.bankStatementUrl });

        try {
            const res = await ApiClientInstance.get(`${accountId}/${from}/${to}`, null, { 'X-Token': token.value });

            if (!res && !res.data || res.status === 400) return [];
            const transactionsArray = res.data.map(tx => ({
                ...tx,
                accountId,
                time          : new Date(tx.time * 1000),
                userId        : this.context.userId,
                type          : tx.amount > 0 ? ACCRUAL : WITHDRAWAL,
                transactionId : tx.id
            }));

            return Transaction.bulkCreateConsecutive(transactionsArray);
        } catch (error) {
            console.error('Error fetching transactions from Monobank: ', error);
            throw error;
        }
    }

    #fetchTransactions(year, month, accountId) {
        return Transaction.scope([
            { method: [ 'accountId', accountId ] },
            { method: [ 'time', year, month ] }
        ]).findAll({
            order : [ [ 'time', 'DESC' ] ]
        });
    }

    async #listTransactions({ year, month, accountId }) {
        const transactions = await this.#fetchTransactions(year, month, accountId);

        if (!transactions) return [];

        const totalSpendings = transactions.reduce(
            (total, { amount, type }) =>
                this.#calculateTotalSpendings(total, amount, type),
            { income: 0, expenses: 0 }
        );

        return {
            data : transactions,
            totalSpendings
        };
    }

    async #listTransactionsGrouped({ year, month, accountId }) {
        const transactions = await this.#fetchTransactions(year, month, accountId);

        if (!transactions) return [];

        const groupedTransactions = transactions.reduce((acc, transaction) => {
            const { mcc, type, amount } = transaction;

            let mccCategory = 'Other';

            for (const [ category, codes ] of Object.entries(MCC_CATEGORIES)) {
                if (codes.includes(String(mcc))) {
                    mccCategory = category;
                    break;
                }
            }

            if (!acc[mccCategory]) {
                acc[mccCategory] = {
                    transactions           : [],
                    categoryTotalSpendings : { income: 0, expenses: 0 }
                };
            }

            acc[mccCategory].transactions.push(transaction);
            acc[mccCategory].categoryTotalSpendings = this.#calculateTotalSpendings(
                acc[mccCategory].categoryTotalSpendings,
                amount,
                type
            );

            return acc;
        }, {});

        return {
            data           : groupedTransactions,
            totalSpendings : transactions.reduce(
                (total, { amount, type }) =>
                    this.#calculateTotalSpendings(total, amount, type),
                { income: 0, expenses: 0 }
            )
        };
    }

    #validateYearMonth(year, month) {
        if (year > 0 && month >= 1 && month <= 12) {
            const date = DateTime.fromObject({ year, month, day: 1 });

            return date.isValid;
        }

        return false;
    }

    #calculateTotalSpendings(currentTotal, amount, type) {
        return {
            income   : type === ACCRUAL ? currentTotal.income + amount : currentTotal.income,
            expenses : type === WITHDRAWAL ? currentTotal.expenses + amount : currentTotal.expenses
        };
    }
}
