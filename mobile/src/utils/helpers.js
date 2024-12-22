import queryString from 'query-string'

/* eslint-disable no-magic-numbers */
// import moment from 'moment'


export function getSearchParams(query = {}) {
    return `?${queryString.stringify(query)}`
}

export function convertToQueryParam(params) {
    if (!Object.keys.length) return ''

    const str = []

    for (const p in params) {
        if (params.hasOwnProperty(p)) {
            if (params[p]) {
                str.push(`${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`)
            }
        }
    }

    return str.join('&')
}

export function getProperty(obj, path) {
    const pathArray = path.split('.')

    pathArray.forEach(key => {
        // eslint-disable-next-line no-param-reassign
        obj = obj?.[key]
    })

    return obj
}

export function joinArrays(oldArray, newList) {
    if (oldArray.length === 0) {
        return newList
    }

    const updatedOldArray = oldArray.map(item => {
        const itemNew = newList.find(element => element.id === item.id)

        if (itemNew) {
            return itemNew
        }

        return item
    })


    return [...updatedOldArray, ...newList.filter(item => {
        return !updatedOldArray.find(message => message.id === item.id)
    })]
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// export function formatLastMessageDate(lastMessageDateString) {
//     const messageDate = moment(lastMessageDateString)
//     const today = moment()

//     if (messageDate.isSame(today, 'day')) {
//         return messageDate.from(today)
//     }

//     if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) {
//         return 'Yesterday'
//     }

//     return messageDate.isSame(today, 'year') ? moment(messageDate).format('D MMMM') : moment(messageDate).format('D MMMM YYYY')
// }

export function formatBytes(bytes, decimals) {
    if (bytes === 0) return '0 bytes'
    const k = 1024

    const dm = decimals || 2

    const sizes = ['bytes', 'kb', 'mb', 'gb']

    const i = Math.floor(Math.log(bytes) / Math.log(k))


    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export const isObjectEmpty = (objectName) => {
    return (
        objectName &&
        Object.keys(objectName).length === 0 &&
        objectName.constructor === Object
    )
}