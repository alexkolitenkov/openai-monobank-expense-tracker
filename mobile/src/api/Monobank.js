import { handleRequest } from "../utils/request.js"
import Base from "./Base.js"

class Monobank extends Base {
    connect = async token => await handleRequest(this.apiClient.post(`monobank/connect/${token}`)) 
    getTokenValue = async () => await handleRequest(this.apiClient.get('monobank/token'))
    getUserAccountsInfo = async token => await handleRequest(this.apiClient.get(`monobank/userAccountsInfo/${token}`)) 
}

export default Monobank