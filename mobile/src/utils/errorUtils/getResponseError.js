import errorCodeMessages from '../../constants/errorCodeMessages.js'

export const getResponseError = (error) => {
    const errorMessages = {}
    for (const errorField of Object.keys(error)) {
        errorMessages[errorField] = errorCodeMessages[error[errorField]]
    }

    return errorMessages
}