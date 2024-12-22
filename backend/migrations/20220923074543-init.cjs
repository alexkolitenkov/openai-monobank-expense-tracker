module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id             : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            name           : { type: Sequelize.STRING, allowNull: false },
            email          : { type: Sequelize.STRING, allowNull: false, unique: true },
            passwordHash   : { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
            salt           : { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
            state          : { type: Sequelize.ENUM('ACTIVE', 'PENDING'), allowNull: false },
            defaultAccount : { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
            isTokenSaved   : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
            createdAt      : { type: Sequelize.DATE, allowNull: false },
            updatedAt      : { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable('SystemActions', {
            id        : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            type      : { type: Sequelize.ENUM('USER_ACTIVATION', 'FORGOT_PASSWORD'), allowNull: false },
            userId    : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable('Tokens', {
            id        : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            value     : { type: Sequelize.STRING, allowNull: false, unique: true },
            type      : { type: Sequelize.ENUM('MONOBANK'), allowNull: false },
            userId    : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable('Sessions', {
            sid     : { type: Sequelize.STRING, primaryKey: true },
            expires : { type: Sequelize.DATE },
            data    : { type: Sequelize.TEXT },
            userId  : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } }
        });

        await queryInterface.createTable('Transactions', {
            id             : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            transactionId  : { type: Sequelize.STRING, allowNull: false, unique: true },
            accountId      : { type: Sequelize.STRING, allowNull: false },
            userId         : { type: Sequelize.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
            time           : { type: Sequelize.STRING, allowNull: false },
            description    : { type: Sequelize.TEXT, allowNull: false },
            mcc            : { type: Sequelize.INTEGER, allowNull: false },
            hold           : { type: Sequelize.BOOLEAN, allowNull: false },
            amount         : { type: Sequelize.BIGINT, allowNull: false },
            type           : { type: Sequelize.ENUM('ACCRUAL', 'WITHDRAWAL'), allowNull: false },
            cashbackAmount : { type: Sequelize.BIGINT, allowNull: false },
            balance        : { type: Sequelize.BIGINT, allowNull: false },
            comment        : { type: Sequelize.TEXT, allowNull: true },
            receiptId      : { type: Sequelize.STRING, allowNull: true },
            invoiceId      : { type: Sequelize.STRING, allowNull: true },
            counterEdrpou  : { type: Sequelize.STRING, allowNull: true },
            counterIban    : { type: Sequelize.STRING, allowNull: true },
            counterName    : { type: Sequelize.TEXT, allowNull: true }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('SystemActions');
        await queryInterface.dropTable('Tokens');
        await queryInterface.dropTable('Sessions');
        await queryInterface.dropTable('Transactions');
        await queryInterface.dropTable('Users');
    }
};
