import ApiClient from './ApiClient.js'
import SessionAPI from './Session.js'
import ProfileAPI from './Profile.js'
import MonobankAPI from './Monobank.js'
import TransactionsAPI from './Transactions.js'

export default function apiFactory({ apiPrefix } = {}) {
    if (!apiPrefix) {
        throw new Error('[apiPrefix] required')
    }

    const api = new ApiClient({ prefix: apiPrefix })

    return {
        apiClient: api,
        session: new SessionAPI({ apiClient: api }),
        profile: new ProfileAPI({ apiClient: api }),
        monobank: new MonobankAPI({ apiClient: api }),
        transactions: new TransactionsAPI({ apiClient: api })
    }
}
