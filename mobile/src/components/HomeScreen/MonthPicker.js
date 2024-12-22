import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTransactions } from '../../contexts/TransactionsContext'
import { useAuth } from '../../contexts/AuthContext'
import CustomActivityIndicator from '../CustomActivityIndicator'
import { storeData, storeMultipleItems } from '../../utils/AsyncStorage'
import { STORAGE_KEYS } from '../../constants/storageKeys'
export const MonthPicker = ({ isVisible, toggleMonthPicker, setYear, setMonth }) => {
    const { user } = useAuth()
    const { fetchTransactionsAndTotalSpendings, filters, setGroupedTransactions, setTransactions, setTotalSpendings } = useTransactions()

    const [selectedMonth, setSelectedMonth] = useState(null)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [isLoading, setIsLoading] = useState(false)
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const handleMonthSelect = (month) => {
        setSelectedMonth(month)
    }

    const handleNextYear = () => {
        setSelectedYear((prev) => prev + 1)
    }

    const handlePrevYear = () => {
        setSelectedYear((prev) => prev - 1)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const { data, totalSpendings } = await fetchTransactionsAndTotalSpendings({
            accountId: user.defaultAccount,
            year: selectedYear,
            month: selectedMonth + 1,
            grouped: filters.isGrouped
        })

        await storeMultipleItems(
            [
                [STORAGE_KEYS.YEAR, String(selectedYear)],
                [STORAGE_KEYS.MONTH, String(selectedMonth + 1)],
                [STORAGE_KEYS.IS_GROUPED, String(filters.isGrouped)],
            ]
        )

        if (filters.isGrouped) {
            await storeData(STORAGE_KEYS.GROUPED_TRANSACTIONS, data)
            setGroupedTransactions(data)
        } else {
            await storeData(STORAGE_KEYS.TRANSACTIONS, data)
            setTransactions(data)
        }
        setTotalSpendings(totalSpendings)
        await storeData(STORAGE_KEYS.TOTAL_SPENDINGS, totalSpendings)

        setYear(selectedYear)
        setMonth(selectedMonth + 1)
        toggleMonthPicker()
        setIsLoading(false)
    }

    const handleCancel = () => {
        toggleMonthPicker()
    }

    if (isLoading) {
        return (
            <CustomActivityIndicator />
        )
    }
    return (
        <Modal visible={isVisible} transparent={true} animationType='slide'>
            <View style={styles.modalContainer}>
                <View style={styles.datePickerContainer}>
                    {/* Year Navigation */}
                    <View style={styles.yearPickerContainer}>
                        <TouchableOpacity onPress={handlePrevYear}>
                            <MaterialIcons name='keyboard-arrow-left' size={30} color='#4b6584' />
                        </TouchableOpacity>
                        <Text style={styles.yearText}>{selectedYear}</Text>
                        <TouchableOpacity onPress={handleNextYear}>
                            <MaterialIcons name='keyboard-arrow-right' size={30} color='#4b6584' />
                        </TouchableOpacity>
                    </View>

                    {/* Month Grid */}
                    <View style={styles.monthGridContainer}>
                        {months.map((month, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.monthButton, selectedMonth === index && styles.selectedMonthButton]}
                                onPress={() => handleMonthSelect(index)}
                            >
                                <Text style={[styles.monthText, selectedMonth === index && styles.selectedMonthText]}>
                                    {month}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* OK/Cancel Buttons */}
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity onPress={handleCancel}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={styles.okButton}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    datePickerContainer: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
    },
    yearPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    yearText: {
        color: '#4b6584',
        fontSize: 18,
        fontWeight: 'bold',
    },
    monthGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    monthButton: {
        width: '30%',
        marginBottom: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    selectedMonthButton: {
        backgroundColor: '#4b6584',
    },
    monthText: {
        fontSize: 16,
        color: '#4b6584',
    },
    selectedMonthText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    cancelButton: {
        fontSize: 16,
        color: '#4b6584',
    },
    okButton: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#4b6584',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
})
