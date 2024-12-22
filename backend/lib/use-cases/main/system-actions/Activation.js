import UseCaseBase  from '../../Base.js';
import User         from '../../../domain-model/User.js';
import SystemAction from '../../../domain-model/SystemAction.js';

export class Activation extends UseCaseBase {
    static validationRules = {
        id : [ 'string', 'required', 'positive_integer' ]
    }

    async execute({ id }) {
        const { dataValues: systemActionRecord } = await SystemAction.scope([ { method: [ 'id', id ] } ]).findOne();

        await User.scope([ { method: [ 'id', systemActionRecord.userId ] } ]).update({ state: User.STATE_TYPES.ACTIVE });
        await SystemAction.scope([ { method: [ 'id', id ] } ]).destroy();

        // return {
        //     message : 'The user\'s account was activated. Removing System Activation record'
        // };
        const html = '<h1>Your account has been activated</h1>';

        return html;
    }
}
