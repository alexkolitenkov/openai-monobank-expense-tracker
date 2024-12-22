import Exception    from 'chista/Exception.js';
import UseCaseBase  from '../../Base.js';
import User         from '../../../domain-model/User.js';
import { dumpUser } from '../utils/dumps.js';

export class Update extends UseCaseBase {
    static validationRules = {
        name           : [ 'trim', 'not_empty', 'string', { 'max_length': 255 } ],
        email          : [ 'trim', 'to_lc', 'not_empty', 'email', { 'max_length': 255 } ],
        isTokenSaved   : [ 'integer', { 'min_number': 0 }, { 'max_number': 1 } ],
        defaultAccount : [ 'string' ]
    }

    async execute(data) {
        const user = await User.scope([ { method: [ 'id', this.context.userId  ] } ]).findOne();

        if (user.email === data.email && user.name === data.name && user.defaultAccount === data.defaultAccount) {
            throw new Exception.default({
                code   : 'NOT_ALLOWED_VALUE',
                fields : {
                    name  : 'NOT_ALLOWED_VALUE',
                    email : 'NOT_ALLOWED_VALUE'
                }
            });
        }

        const updatedUser = await user.update(data);

        return dumpUser(updatedUser);
    }
}
