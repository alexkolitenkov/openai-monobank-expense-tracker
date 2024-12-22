import sequelize from 'sequelize';
import Base      from './Base.js';
import User      from './User.js';

const { DataTypes: DT } = sequelize;

class SystemAction extends Base {
    static RELATION_TYPES = {
        user : 'user'
    }

    static TYPES = {
        USER_ACTIVATION : 'USER_ACTIVATION',
        FORGOT_PASSWORD : 'FORGOT_PASSWORD'
    }

    static options = {
        scopes : {
            id(id) {
                if (!id) return {};

                return { where: { id } };
            }
        }
    }

    static schema = {
        id        : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        type      : { type: DT.ENUM(Object.values(this.TYPES)), allowNull: false },
        userId    : { type: DT.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
        createdAt : { type: DT.DATE, allowNull: false },
        updatedAt : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.belongsTo(User, { foreignKey: 'userId', as: this.RELATION_TYPES.user });
    }
}

export default SystemAction;
