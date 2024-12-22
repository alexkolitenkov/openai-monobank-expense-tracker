import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { DropdownDrawer } from '../DrawerNavigation/DropdownDrawer'
import { useAuth } from '../../contexts/AuthContext'
import CustomActivityIndicator from '../CustomActivityIndicator'
import { useTransactions } from '../../contexts/TransactionsContext'
import { useMonobank } from '../../contexts/MonobankContext'
import { storeData, storeMultipleItems } from '../../utils/AsyncStorage'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import { CURRENCY_INFO } from '../../constants/currencyInfo'
import { handleChange } from '../../utils/handleChange'
import { DATA_KEYS } from '../../constants/dataKeys'
import { getResponseError } from '../../utils/errorUtils/getResponseError'
import { setErrorMessage } from '../../utils/errorUtils/setErrorMessage'
import ModalInput from '../CustomInput'
export const EditUserInfoModal = ({ visible, onClose }) => {
    const { user, dispatch, updateUser } = useAuth()
    const { dropdownData, setCardNumber, setCurrencySymbol } = useMonobank()
    const { fetchTransactionsAndTotalSpendings, setGroupedTransactions, setTransactions, filters, setTotalSpendings } = useTransactions()
    const [data, setData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        defaultAccount: user?.defaultAccount || '',
    })
    const [errors, setErrors] = useState({})

    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        setErrors({})
        const { ...updatedFields } = data

        try {
            const updatedUserServerInstance = await updateUser(updatedFields)
            dispatch({ type: 'SET_APP_STATE', payload: { user: { ...updatedUserServerInstance } } })
            if (updatedFields.defaultAccount !== user.defaultAccount) {
                const card = dropdownData.find(item => item.accountId === updatedUserServerInstance.defaultAccount)

                if (card) {
                    setCardNumber(card.value)
                    setCurrencySymbol(CURRENCY_INFO.symbols[card.label])
                    await storeData(STORAGE_KEYS.CARD_NUMBER, card.value)
                    await storeData(STORAGE_KEYS.CURRENCY_SYMBOL, CURRENCY_INFO.symbols[card.label])
                }

                const { data, totalSpendings } = await fetchTransactionsAndTotalSpendings({
                    accountId: updatedUserServerInstance.defaultAccount,
                    year: filters.year,
                    month: filters.month,
                    grouped: filters.isGrouped
                })

                await storeMultipleItems(
                    [
                        [STORAGE_KEYS.YEAR, String(filters.year)],
                        [STORAGE_KEYS.MONTH, String(filters.month)],
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
                onClose()
                return
            }
            onClose()
        } catch (error) {
            console.log('Failed to update user info:', error)
            setErrors(getResponseError(error))
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        onClose()
        setErrors({})
        setData({
            name: user?.name || '',
            email: user?.email || '',
            defaultAccount: user?.defaultAccount || '',
        })
    }

    if (isLoading) {
        return (
            <CustomActivityIndicator />
        )
    }

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit User Information</Text>

                    <ModalInput
                        placeholder='Name'
                        value={data.name}
                        setValue={(value) => handleChange(DATA_KEYS.NAME, value, setData)}
                        editable={!isLoading}
                        errorMessage={errors?.name}
                        inputName={DATA_KEYS.NAME}
                        setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
                    />

                    <ModalInput
                        placeholder='Email'
                        value={data.email}
                        setValue={(value) => handleChange(DATA_KEYS.EMAIL, value, setData)}
                        editable={!isLoading}
                        errorMessage={errors?.email}
                        inputName={DATA_KEYS.EMAIL}
                        setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
                        keyboardType='email-address'
                    />

                    <DropdownDrawer
                        setData={setData}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        gap: 10
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color:'#a1a1a1'
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        color:'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f53b57',
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 5,
    },
    saveButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#34c759',
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})
