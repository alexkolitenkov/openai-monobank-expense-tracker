import _Exception    from 'chista/Exception.js';
import UseCaseBase   from '../../Base.js';
import { ApiClient } from '../../../infrastructure/api-client/ApiClient.js';
import config        from '../../../config.cjs';
import Token         from '../../../domain-model/Token.js';

const { MONOBANK } = Token.TYPES;
const X = _Exception.default;

export class Connect extends UseCaseBase {
    static validationRules = {
        token : [ 'required', 'string', { 'max_length': 255 } ]
    }

    async execute({ token }) {
        const ApiClientInstance = new ApiClient({ baseUrl: config.clientInfoUrl });
        const res = await ApiClientInstance.get('', null, { 'X-Token': token });

        if (res.status !== 200 || !res.data.clientId) {
            throw this.error || new X({
                code   : 'AUTHENTICATION_FAILED',
                fields : { token: 'WRONG_TOKEN' }
            });
        }

        const userAccountsInfo = res.data.accounts.map(account => ({
            currencyCode : account.currencyCode,
            maskedPan    : account.maskedPan,
            type         : account.type,
            accountId    : account.id
        }));

        const userToken = await Token.create({
            value  : token,
            type   : MONOBANK,
            userId : this.context.userId
        });

        return {
            ...userToken,
            userAccountsInfo
        };
    }
}
