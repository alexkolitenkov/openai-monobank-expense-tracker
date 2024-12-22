import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { handleChange } from '../../utils/handleChange.js'

import CustomActivityIndicator from '../../components/CustomActivityIndicator.js'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { MonthPicker } from '../../components/HomeScreen/MonthPicker.js'
import { DropdownHomeScreen } from '../../components/HomeScreen/DropdownHomeScreen.js'
import { TransactionList } from '../../components/HomeScreen/TransactionList.js'
import { HomeHeader } from '../../components/HomeScreen/HomeHeader.js'
import { ExpensesByCategory } from '../../components/HomeScreen/CategoryExpenses.js'

import { DATA_KEYS } from '../../constants/dataKeys.js'
import { useAuth } from '../../contexts/AuthContext.js'
import { useTransactions } from '../../contexts/TransactionsContext.js'
import { storeData, storeMultipleItems } from '../../utils/AsyncStorage.js'
import { STORAGE_KEYS } from '../../constants/storageKeys.js'
import { useMonobank } from '../../contexts/MonobankContext.js'
import FinancialAdvice from '../../components/HomeScreen/FinancialAdvice.js'
const { YEAR, MONTH, IS_GROUPED } = DATA_KEYS

const HomeScreen = () => {
    const { user } = useAuth()
    const {
        fetchTransactionsAndTotalSpendings, loadTransactionsAndTotalSpendings,
        filters, loadFilters, setFilters, setGroupedTransactions,
        setTransactions, setTotalSpendings
    } = useTransactions()
    const { loadUserAccountsInfo } = useMonobank()
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isFiltersLoaded, setIsFiltersLoaded] = useState(false)
    const [isUserAccountsInfoLoaded, setIsUserAccountsInfoLoaded] = useState(false)

    useEffect(() => {
        const initializeData = async () => {
            await Promise.all([fetchUserAccountsInfo(), initializeFilters()]) // Wait for both async functions to complete
            setIsLoading(false)
        }

        const initializeFilters = async () => {
            await loadFilters() // Load and update filters from AsyncStorage
            setIsFiltersLoaded(true)
        }

        const fetchUserAccountsInfo = async () => {
            await loadUserAccountsInfo(user)
            setIsUserAccountsInfoLoaded(true)
        }

        initializeData()
    }, [user])

    useEffect(() => {
        const fetchTransactions = async () => {
            if (isFiltersLoaded && isUserAccountsInfoLoaded && user.defaultAccount) {
                // if (isFiltersLoaded && isUserAccountsInfoLoaded) {
                setIsLoading(true)
                await loadTransactionsAndTotalSpendings()
                setIsLoading(false)
            }
        }
        fetchTransactions()
    }, [isFiltersLoaded, isUserAccountsInfoLoaded, user.defaultAccount])
    // }, [isFiltersLoaded, isUserAccountsInfoLoaded])

    const toggleMonthPicker = () => {
        setMonthPickerVisible(!isMonthPickerVisible)
    }

    const toggleView = async () => {
        setIsLoading(true)
        const newIsGrouped = !filters.isGrouped
        handleChange(IS_GROUPED, newIsGrouped, setFilters)

        const { data, totalSpendings } = await fetchTransactionsAndTotalSpendings({
            accountId: user.defaultAccount,
            year: filters.year,
            month: filters.month,
            grouped: newIsGrouped
        })

        await storeMultipleItems(
            [
                [STORAGE_KEYS.YEAR, String(filters.year)],
                [STORAGE_KEYS.MONTH, String(filters.month)],
                [STORAGE_KEYS.IS_GROUPED, String(newIsGrouped)],
            ]
        )

        if (newIsGrouped) {
            await storeData(STORAGE_KEYS.GROUPED_TRANSACTIONS, data)
            setGroupedTransactions(data)
        } else {
            await storeData(STORAGE_KEYS.TRANSACTIONS, data)
            setTransactions(data)
        }
        setTotalSpendings(totalSpendings)
        await storeData(STORAGE_KEYS.TOTAL_SPENDINGS, totalSpendings)
        setIsLoading(false)
    }

    if (isLoading) {
        return <CustomActivityIndicator />
    }

    return (
        <View style={styles.container}>
            <HomeHeader />
            {user && !user.defaultAccount && (
                <DropdownHomeScreen />
            )}
            {user && user.defaultAccount && (
                <>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
                            <Text>
                                <View style={styles.toggleViewBackground}>
                                    {filters.isGrouped ?
                                        <MaterialIcons name='view-list' size={24} color='#4b6584' /> :
                                        <MaterialIcons name='category' size={24} color='#4b6584' />}
                                </View>
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.isGroupedText}>{filters.isGrouped ? 'Categories' : 'Transactions'}</Text>

                        <TouchableOpacity onPress={toggleMonthPicker}>
                            <View style={styles.toggleViewBackground}>
                                <MaterialIcons name='date-range' size={32} color='#4b6584' />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <FinancialAdvice />
                    <View style={{ flex: 1 }}>
                        {filters.isGrouped ? <ExpensesByCategory /> : <TransactionList />}
                    </View>

                    <MonthPicker
                        isVisible={isMonthPickerVisible}
                        toggleMonthPicker={toggleMonthPicker}
                        setMonth={(newMonth) => handleChange(MONTH, newMonth, setFilters)}
                        setYear={(newYear) => handleChange(YEAR, newYear, setFilters)}
                    />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    isGroupedText: {
        fontSize: 20,
        color: '#4b6584',
        fontWeight: 'bold',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleViewBackground: {
        backgroundColor: '#f1f2f6',
        padding: 10,
        borderRadius: 50,

    },
    toggleViewBackgroundAdvise: {
        backgroundColor: '#f1f2f6',
        shadowColor: '#4b6584',
        shadowOffset: {
            width: 4,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },

    toggleButtonAdvise: {
        position: 'absolute',
        bottom: 15,
        right: 18
    }
})

export default HomeScreen
