import chista                  from '../../chista.js';
import { Registration }        from '../../../../use-cases/main/users/Registration.js';
import SessionsCheck           from '../../../../use-cases/main/users/Check.js';
import { Login }               from '../../../../use-cases/main/users/Login.js';
import { sessionRender }       from '../../sessionRender.mjs';
import { renderPromiseAsJson } from '../../utils/chistaUtils.mjs';
import { Profile }             from '../../../../use-cases/main/users/Profile.js';
import { Update }              from '../../../../use-cases/main/users/Update.js';
import { Logout }              from '../../../../use-cases/main/users/Logout.js';

export default {
    register : chista.makeUseCaseRunner(Registration, req => ({
        ...req.body,
        useragent : { ...req.useragent, ip: req.clientIp }
    }), undefined, undefined, sessionRender),
    login : chista.makeUseCaseRunner(Login, req => ({
        ...req.body,
        useragent : { ...req.useragent, ip: req.clientIp }
    }), undefined, undefined, sessionRender),
    logout : chista.makeUseCaseRunner(Logout, req => req.params),
    async check(req, res, next) {
        const promise = chista.runUseCase(SessionsCheck, {
            params : { session: { context: req.session.context } }
        });

        try {
            await promise;

            return next();
        } catch (e) {
            return renderPromiseAsJson(req, res, promise);
        }
    },
    profile : chista.makeUseCaseRunner(Profile, req => req.params),
    update  : chista.makeUseCaseRunner(Update, req => ({ ...req.body, ...req.params }))

};
