// import { notification }         from 'antd'
// import i18n                     from 'i18next'
import { ERROR_TYPES }  from '../constants/errorTypes.js'
// import { removeSessionStorage } from './storage'
// import ErrorService from './errors'
// import { history }              from './history'

export async function handleRequest(promise) {
    try {
        const data = await promise

        return data
    } catch (err) {
        // const { code, errors } = err || {}
        const { error: { code, fields } } = err || {}
        if (code === ERROR_TYPES.UNAUTHORIZED) {
            throw code
        }
        // if (code === ERROR_TYPES.UNAUTHORIZED
        //     && errors.length === 0
        //     && history.location.pathname !== ROUTES.PUBLIC_APPLICATION) {
        //     notification.error({
        //         key     : ERROR_TYPES.UNAUTHORIZED,
        //         message : i18n.t('error.authenticationFailed')
        //     })

        //     removeSessionStorage('token')

        //     return history.replace(ROUTES.LOGIN)
        // }

        throw fields
    }
}
