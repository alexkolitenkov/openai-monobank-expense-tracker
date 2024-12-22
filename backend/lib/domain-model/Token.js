import sequelize            from 'sequelize';
import { encrypt, decrypt } from '../utils/encrypt-decrypt.js';
import config               from '../config.cjs';
import Base                 from './Base.js';
import User                 from './User.js';

const { DataTypes: DT } = sequelize;

class Token extends Base {
    static RELATION_TYPES = {
        user : 'user'
    }

    static TYPES = {
        MONOBANK : 'MONOBANK'
    }

    static options = {
        scopes : {
            id(id) {
                if (!id) return {};

                return { where: { id } };
            },
            userId(userId) {
                if (!userId) return {};

                return { where: { userId } };
            }
        }
    }

    static schema = {
        id    : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        value : {
            type : DT.STRING,
            set(plainToken) {
                const encryptedToken = encrypt(plainToken, config.encryptionSecret);

                this.setDataValue('value', encryptedToken);
            },
            get() {
                return decrypt(this.getDataValue('value'), config.encryptionSecret);
            },
            allowNull : false,
            unique    : true
        },
        type      : { type: DT.ENUM(Object.values(this.TYPES)), allowNull: false },
        userId    : { type: DT.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.belongsTo(User, { foreignKey: 'userId', as: this.RELATION_TYPES.user });
    }
}

export default Token;
