import AsyncStorage from '@react-native-async-storage/async-storage'

const getData = async key => {
    try {
        const serializedData = await AsyncStorage.getItem(key)
        if (!serializedData) return undefined

        return JSON.parse(serializedData)
    } catch (e) {
        console.error('Error reading value from local storage.', e)
        return undefined

    }
}

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error('Error storing data in local storage: ', e)
    }
}

const removeData = async key => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.error('Error removing data from local storage. ', e)
    }
}

const getMultipleItems = async keys => {
    try {
        const result = await AsyncStorage.multiGet(keys)
        return result.reduce((acc, [key, value]) => {
            acc[key] = JSON.parse(value)
            return acc
        }, {})
    } catch (e) {
        console.error('Error retrieving multiple items from local storage. ', e)
    }
}

const storeMultipleItems = async pairsArray => {
    try {
        await AsyncStorage.multiSet(pairsArray)
    } catch (e) {
        console.error('Error setting multiple items in local storage: ', e)
    }
}

const clearAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(keys)
        console.log('Successfully removed all data')
    } catch (error) {
        console.error('Error clearing AsyncStorage:', error)
    }
}

export { getData, storeData, removeData, getMultipleItems, storeMultipleItems, clearAllData }