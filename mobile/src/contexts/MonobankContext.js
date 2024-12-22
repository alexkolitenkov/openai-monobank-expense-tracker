import React, { useContext, createContext, useState, useEffect, useMemo, useCallback } from 'react'
import apiFactory from '../api/apiSingleton'
import { getData, storeData } from '../utils/AsyncStorage'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { CURRENCY_INFO } from '../constants/currencyInfo'
import Config from 'react-native-config'
import { useAuth } from './AuthContext'

const { USER_ACCOUNTS_INFO, CARD_NUMBER, CURRENCY_SYMBOL } = STORAGE_KEYS

const MonobankContext = createContext()

export const MonobankProvider = ({ children }) => {
    const { user } = useAuth()
    const [dropdownData, setDropdownData] = useState([])
    const [cardNumber, setCardNumber] = useState(null)
    const [currencySymbol, setCurrencySymbol] = useState(null)
    const apiMonobankUrl = Config.API_MONOBANK_URL

    const loadUserAccountsInfo = useCallback(async (user) => {
        if (!user) return
    
        let userAccountsInfo = await getData(USER_ACCOUNTS_INFO)
    
        if (!userAccountsInfo) {
            const { token: userMonobankToken } = await apiFactory.monobank.getTokenValue()
            userAccountsInfo = await saveAndReturnUserAccountsInfoAsyncStorage(userMonobankToken)
        }
    
        const formattedDropdownData = formatDropdownData(userAccountsInfo)
        setDropdownData(formattedDropdownData)
    
        if (user.defaultAccount) {
            const newCardNumber = await getOrRetrieveCardNumber(formattedDropdownData, user)
            setCardNumber(newCardNumber)
            const newCurrencySymbol = await getOrRetrieveCurrencySymbol(formattedDropdownData, user)
            setCurrencySymbol(newCurrencySymbol)
        }
    }, [user])

    const formatDropdownData = (accountsInfo) =>
        accountsInfo.map((card) => ({
            value: card.maskedPan[0] ? card.maskedPan[0] : card.type,
            label: CURRENCY_INFO.codes[card.currencyCode],
            accountId: card.accountId,
        }))
    
    const getOrRetrieveCardNumber = async (dropdownData, user) => {
        let storedCardNumber = await getData(CARD_NUMBER)
        if (!storedCardNumber) {
            const card = dropdownData.find((item) => item.accountId === user?.defaultAccount)
            storedCardNumber = card?.value
            await storeData(STORAGE_KEYS.CARD_NUMBER, storedCardNumber)
        }
        return storedCardNumber
    }
    
    const getOrRetrieveCurrencySymbol = async (dropdownData, user) => {
        let storedCurrencySymbol = await getData(CURRENCY_SYMBOL)
        if (!storedCurrencySymbol) {
            const card = dropdownData.find((item) => item.accountId === user?.defaultAccount)
            storedCurrencySymbol = CURRENCY_INFO.symbols[card?.label]
            await storeData(STORAGE_KEYS.CURRENCY_SYMBOL, storedCurrencySymbol)
        }
        return storedCurrencySymbol
    }
    
    const saveAndReturnUserAccountsInfoAsyncStorage = async (token) => {
        const userAccountsInfo = await apiFactory.monobank.getUserAccountsInfo(token)
        await storeData(USER_ACCOUNTS_INFO, userAccountsInfo)
        return userAccountsInfo
    }

    const value = useMemo(() => ({
        dropdownData,
        cardNumber,
        setCardNumber,
        saveAndReturnUserAccountsInfoAsyncStorage,
        loadUserAccountsInfo,
        apiMonobankUrl,
        currencySymbol,
        connect: apiFactory.monobank.connect,
        setCurrencySymbol
    }), [dropdownData,
        cardNumber,
        saveAndReturnUserAccountsInfoAsyncStorage,
        apiFactory.monobank.connect,
        apiMonobankUrl,
        loadUserAccountsInfo,
        currencySymbol
    ])

    return <MonobankContext.Provider value={value}>{children}</MonobankContext.Provider>
}

export const useMonobank = () => {
    const context = useContext(MonobankContext)
    if (!context) {
        throw new Error("useMonobank must be used within an MonobankProvider")
    }
    return context
}