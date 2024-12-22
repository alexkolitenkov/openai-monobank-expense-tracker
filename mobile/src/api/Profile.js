import { handleRequest } from '../utils/request.js'
import Base              from './Base.js'

class Profile extends Base {
    show = async () => {
        const data = await handleRequest(this.apiClient.get(`user/profile`))

        return data
    }

    update = async payload => {
        const data = await handleRequest(this.apiClient.patch('user/update', payload))

        return data
    }
}

export default Profile
