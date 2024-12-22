import Exception from 'chista/Exception.js';
import Session   from '../../../domain-model/Session.js';
import User      from '../../../domain-model/User.js';
import Base      from './../../Base.js';

const { PENDING } = User.STATE_TYPES;

export default class SessionsCheck extends Base {
    static validationRules = {
        session : [ 'required' ]
    };

    async execute({ session }) {
        await Session.validateSession(session);

        const unactiveUser = await User.scope([ { method: [ 'id', this.context.userId  ] } ]).findOne();

        if (unactiveUser.state === PENDING) {
            throw new Exception.default({
                code   : 'UNACTIVE_USER',
                fields : { session: 'UNACTIVE_USER' }
            });
        }

        return {};
    }
}
