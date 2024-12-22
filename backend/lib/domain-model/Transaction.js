import sequelize, { Op }          from 'sequelize';
import { generateConsecutiveIds } from '../utils/index.js';
import Base                       from './Base.js';
import User                       from './User.js';

const { DataTypes: DT } = sequelize;

class Transaction extends Base {
    static RELATION_TYPES = {
        user : 'user'
    }

    static TYPES = {
        ACCRUAL    : 'ACCRUAL',
        WITHDRAWAL : 'WITHDRAWAL'
    }

    static options = {
        tableName  : 'Transactions',
        timestamps : false,
        scopes     : {
            accountId(accountId) {
                if (!accountId) return {};

                return { where: { accountId } };
            },
            time(year, month) {
                if (!year || !month) return {};

                return {
                    where : {
                        time : {
                            [Op.and] : [
                                sequelize.where(sequelize.fn('YEAR', sequelize.col('time')), year),
                                sequelize.where(sequelize.fn('MONTH', sequelize.col('time')), month)
                            ]
                        }
                    }
                };
            }
        }
    }

    static schema = {
        id             : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        transactionId  : { type: DT.STRING, allowNull: false, unique: true },
        accountId      : { type: DT.STRING, allowNull: false },
        userId         : { type: DT.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
        time           : { type: DT.STRING, allowNull: false },
        description    : { type: DT.TEXT, allowNull: false },
        mcc            : { type: DT.INTEGER, allowNull: false },
        hold           : { type: DT.BOOLEAN, allowNull: false },
        amount         : { type: DT.BIGINT, allowNull: false },
        type           : { type: DT.ENUM(Object.values(this.TYPES)), allowNull: false },
        cashbackAmount : { type: DT.BIGINT, allowNull: false },
        balance        : { type: DT.BIGINT, allowNull: false },
        comment        : { type: DT.TEXT, allowNull: true },
        receiptId      : { type: DT.STRING, allowNull: true },
        invoiceId      : { type: DT.STRING, allowNull: true },
        counterEdrpou  : { type: DT.STRING, allowNull: true },
        counterIban    : { type: DT.STRING, allowNull: true },
        counterName    : { type: DT.TEXT, allowNull: true }
    };

    static initRelations() {
        this.belongsTo(User, { foreignKey: 'userId', as: this.RELATION_TYPES.user });
    }

    static async bulkCreateConsecutive(data = []) {
        const ids = generateConsecutiveIds(data.length);
        const dataWithIds = data.map((item, index) => ({ ...item, id: ids[index] }));

        // return super.bulkCreate(dataWithIds, options);
        return super.bulkCreate(dataWithIds, { ignoreDuplicates: true });
    }
}

export default Transaction;
