import React, { useContext, createContext, useState, useMemo } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { getMultipleItems, getData, storeData } from '../utils/AsyncStorage'
import apiFactory from '../api/apiSingleton'
import { useAuth } from './AuthContext'

const TransactionsContext = createContext()

export const TransactionsProvider = ({ children }) => {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [groupedTransactions, setGroupedTransactions] = useState({})
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        isGrouped: false,
    })
    const [totalSpendings, setTotalSpendings] = useState({ income: 0, expenses: 0 })

    const loadFilters = async () => {
        try {
            const { year, month, isGrouped } = await getMultipleItems([
                STORAGE_KEYS.YEAR,
                STORAGE_KEYS.MONTH,
                STORAGE_KEYS.IS_GROUPED,
            ])

            setFilters({
                year: year ?? new Date().getFullYear(),
                month: month ?? new Date().getMonth() + 1,
                isGrouped: isGrouped ?? false,
            })
        } catch (error) {
            console.error("Error loading filters:", error)
        }

    }


    const loadTransactionsAndTotalSpendings = async () => {
        try {
            const storageKey = filters.isGrouped ? STORAGE_KEYS.GROUPED_TRANSACTIONS : STORAGE_KEYS.TRANSACTIONS

            const storedData = await getData(storageKey)
            const storedTotalSpendings = await getData(STORAGE_KEYS.TOTAL_SPENDINGS)

            if (storedData && storedTotalSpendings) {
                filters.isGrouped ? setGroupedTransactions(storedData) : setTransactions(storedData)
                setTotalSpendings(storedTotalSpendings)
            } else {
                const { data, totalSpendings } = await apiFactory.transactions.list({
                    accountId: user?.defaultAccount,
                    year: filters?.year,
                    month: filters?.month,
                    grouped: filters?.isGrouped
                })

                if (filters.isGrouped) {
                    setGroupedTransactions(data)
                    await storeData(STORAGE_KEYS.GROUPED_TRANSACTIONS, data)
                } else {
                    setTransactions(data)
                    await storeData(STORAGE_KEYS.TRANSACTIONS, data)
                }

                setTotalSpendings(totalSpendings)
                await storeData(STORAGE_KEYS.TOTAL_SPENDINGS, totalSpendings)
            }
        } catch (error) {
            console.error("Failed to load transactions:", error)
        }
    }


    const contextValue = useMemo(
        () => ({
            fetchTransactionsAndTotalSpendings: apiFactory.transactions.list,
            fetchAllData: apiFactory.transactions.listAll,
            loadTransactionsAndTotalSpendings,
            transactions,
            totalSpendings,
            loadFilters,
            groupedTransactions,
            filters,
            setFilters,
            setTransactions,
            setGroupedTransactions,
            setTotalSpendings
        }),
        [transactions, groupedTransactions, totalSpendings, apiFactory.transactions.list, filters, loadFilters, loadTransactionsAndTotalSpendings]
    )

    return <TransactionsContext.Provider value={contextValue}>{children}</TransactionsContext.Provider>
}

export const useTransactions = () => {
    const context = useContext(TransactionsContext)
    if (!context) {
        throw new Error("useTransactions must be used within a TransactionsProvider")
    }
    return context
}
