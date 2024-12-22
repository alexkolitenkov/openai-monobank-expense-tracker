import { DateTime }       from 'luxon';
import UseCaseBase        from '../../Base.js';
import Transaction        from '../../../domain-model/Transaction.js';
import { MCC_CATEGORIES } from '../../../../constants/mccCategories.js';

const { ACCRUAL, WITHDRAWAL } = Transaction.TYPES;

export class ListAll extends UseCaseBase {
    async validate(payload = {}) {
        if (!this.#validateYearMonth(payload.year, payload.month)) {
            throw new Error('Invalid year or month');
        }

        return this.doValidation(payload, {
            accountId : [ 'required', 'string', { max_length: 255 } ],
            year      : [ 'required', 'string', { max_length: 4 } ],
            month     : [ 'required', 'string', { one_of: Array.from({ length: 12 }, (_, i) => String(i + 1)) } ]
        });
    }

    async execute({ year, month, accountId }) {
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
                    categoryTotalSpendings : { income: 0, expenses: 0 }
                };
            }

            acc[mccCategory].categoryTotalSpendings = this.#calculateTotalSpendings(
                acc[mccCategory].categoryTotalSpendings,
                amount,
                type
            );

            return acc;
        }, {});

        const totalSpendings = transactions.reduce(
            (total, { amount, type }) =>
                this.#calculateTotalSpendings(total, amount, type),
            { income: 0, expenses: 0 }
        );

        return {
            transactions,
            categories : groupedTransactions,
            totalSpendings
        };
    }

    #fetchTransactions(year, month, accountId) {
        return Transaction.scope([
            { method: [ 'accountId', accountId ] },
            { method: [ 'time', year, month ] }
        ]).findAll({
            order : [ [ 'time', 'DESC' ] ]
        });
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
