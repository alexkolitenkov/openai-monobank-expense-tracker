import Exception                 from 'chista/Exception.js';
import UseCaseBase               from '../../Base.js';
import User                      from '../../../domain-model/User.js';
import { dumpContext, dumpUser } from '../utils/dumps.js';

const { ACTIVE } = User.STATE_TYPES;

export class Login extends UseCaseBase {
    static validationRules = {
        email    : [ 'required', 'string' ],
        password : [ 'required', 'string' ]
    }

    async execute({ email, password }) {
        const existingUser = await User.scope([ { method: [ 'email', email  ] } ]).findOne();

        if (existingUser === null || existingUser.state !== ACTIVE || !existingUser.checkPassword(password)) {
            throw new Exception.default({
                code   : 'INVALID_CREDENTIALS',
                fields : {
                    email    : 'INVALID_CREDENTIALS',
                    password : 'INVALID_CREDENTIALS'
                }
            });
        }

        return {
            context : dumpContext(existingUser, this.context.useragent),
            user    : dumpUser(existingUser)
        };
    }
}
