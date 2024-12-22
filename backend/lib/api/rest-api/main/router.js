import express     from 'express';
import middlewares from '../middlewares.js';
import controllers from './controllers/index.js';

const router = express.Router();
const { sequelizeSession, detectDevice, detectIp } = middlewares;
const checkSession = controllers.users.check;

export default function init({ sequelize }) {
    router.use(sequelizeSession({ sequelize }));

    router.post('/user/registration', detectIp, detectDevice, controllers.users.register);
    // router.post('/user/check', controllers.users.check);
    router.get('/system-actions/:id', controllers.systemActions.activation);
    router.post('/user/login', detectIp, detectDevice, controllers.users.login);
    router.get('/user/profile', checkSession, controllers.users.profile);
    router.patch('/user/update', checkSession, controllers.users.update);
    router.delete('/user/logout', checkSession, controllers.users.logout);

    router.post('/monobank/connect/:token', checkSession, controllers.monobankActions.connect);
    router.get('/monobank/token', checkSession, controllers.monobankActions.token);
    router.get('/monobank/userAccountsInfo/:token', checkSession, controllers.monobankActions.userAccountsInfo);

    router.get('/transactions/list/:accountId', checkSession, controllers.transactions.list);
    router.get('/transactions/listAll/:accountId', checkSession, controllers.transactions.listAll);

    return router;
}

