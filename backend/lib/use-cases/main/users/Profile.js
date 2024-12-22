// import Exception       from 'chista/Exception.js';
import UseCaseBase  from '../../Base.js';
import User         from '../../../domain-model/User.js';
import { dumpUser } from '../utils/dumps.js';

export class Profile extends UseCaseBase {
    static validationRules = {}

    async execute() {
        const existingUser = await User.scope([ { method: [ 'id', this.context.userId  ] } ]).findOne();

        return dumpUser(existingUser);
    }
}
