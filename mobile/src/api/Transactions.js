import { convertToQueryParam } from "../utils/helpers.js"
import { handleRequest } from "../utils/request.js"
import Base from "./Base.js"

class Transactions extends Base {
    list = async ({year, month, accountId, grouped}) => await handleRequest(this.apiClient.get(`transactions/list/${accountId}/?${convertToQueryParam({year, month, grouped: Number(grouped)})}`))
    listAll = async ({year, month, accountId}) => await handleRequest(this.apiClient.get(`transactions/listAll/${accountId}/?${convertToQueryParam({year, month})}`))
}

export default Transactions