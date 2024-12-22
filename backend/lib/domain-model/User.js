import crypto       from 'crypto';
import sequelize    from 'sequelize';
import Base         from './Base.js';
import SystemAction from './SystemAction.js';
import Session      from './Session.js';

const { DataTypes: DT } = sequelize;

const SALT_LENGTH = 16;
const KEY_LENGTH  = 64;

class User extends Base {
    static RELATION_TYPES = {
        systemAction : 'systemAction',
        session      : 'session'
    }

    static STATE_TYPES = {
        ACTIVE  : 'ACTIVE',
        PENDING : 'PENDING'
    }

    static options = {
        scopes : {
            id(id) {
                if (!id) return {};

                return { where: { id } };
            },
            email(email) {
                if (!email) return {};

                return { where: { email } };
            }
        }
    }

    static schema = {
        id           : { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
        name         : { type: DT.STRING, allowNull: false },
        email        : { type: DT.STRING, allowNull: false, unique: true },
        passwordHash : { type: DT.STRING,  allowNull: false, defaultValue: '' },
        salt         : { type: DT.STRING,  allowNull: false, defaultValue: '' },
        state        : { type: DT.ENUM(Object.values(this.STATE_TYPES)), allowNull: false },
        password     : {
            type : DT.VIRTUAL,
            set(password) {
                const salt = this._generateSalt();
                const passwordHash = this._hashPassword(password, salt);

                this.setDataValue('salt', salt);
                this.setDataValue('passwordHash', passwordHash);
            }
        },
        defaultAccount : { type: DT.STRING, allowNull: false, defaultValue: '' },
        isTokenSaved   : { type: DT.BOOLEAN, allowNull: false, defaultValue: 0 },
        createdAt      : { type: DT.DATE, allowNull: false },
        updatedAt      : { type: DT.DATE, allowNull: false }
    };

    static initRelations() {
        this.hasMany(SystemAction, { foreignKey: 'userId', as: this.RELATION_TYPES.systemAction });
        this.hasMany(Session, { foreignKey: 'userId', sourceKey: 'id', as: this.RELATION_TYPES.session });
    }

    _generateSalt() {
        const salt = crypto.randomBytes(SALT_LENGTH);

        return salt.toString('hex');
    }

    _hashPassword(password, salt) {
        const hash = crypto.scryptSync(password, salt, KEY_LENGTH); // eslint-disable-line no-sync

        return hash.toString('hex');
    }

    checkPassword(plain) {
        const hash = this._hashPassword(plain, this.salt);

        return hash === this.passwordHash;
    }
}

export default User;
