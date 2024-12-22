import Base                    from './Base.js'
import { handleRequest } from '../utils/request.js'

class Session extends Base {
    login = async body => {
        const data = await handleRequest(this.apiClient.post('user/login', body))

        return data
    }

    registration = async body => {
        const data = await handleRequest(this.apiClient.post('user/registration', body))

        return data
    }

    logout = () => {
        return handleRequest(this.apiClient.delete('user/logout'))
        
    }
}

export default Session
