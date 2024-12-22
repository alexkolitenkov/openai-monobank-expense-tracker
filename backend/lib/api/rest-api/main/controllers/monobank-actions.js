import chista               from '../../chista.js';
import { Connect }          from '../../../../use-cases/main/monobank/Connect.js';
import { GetTokenValue }    from '../../../../use-cases/main/monobank/GetTokenValue.js';
import { UserAccountsInfo } from '../../../../use-cases/main/monobank/UserAccountsInfo.js';

export default {
    connect          : chista.makeUseCaseRunner(Connect, req => req.params),
    token            : chista.makeUseCaseRunner(GetTokenValue, req => req.params),
    userAccountsInfo : chista.makeUseCaseRunner(UserAccountsInfo, req => req.params)
};
