// import Exception       from 'chista/Exception.js';
import UseCaseBase from '../../Base.js';
import Session     from '../../../domain-model/Session.js';

export class Logout extends UseCaseBase {
    static validationRules = {}

    async execute() {
        await Session.scope([ { method: [ 'userId', this.context.userId ] } ]).destroy();

        return {};
    }
}
