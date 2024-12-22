import UseCaseBase from '../../Base.js';
import Token       from '../../../domain-model/Token.js';

export class GetTokenValue extends UseCaseBase {
    static validationRules = {}

    async execute() {
        const userToken = await Token.scope([ { method: [ 'userId', this.context.userId ] } ]).findOne();

        return {
            token : userToken.value
        };
    }
}

