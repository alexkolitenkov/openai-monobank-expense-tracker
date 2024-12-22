import { StyleSheet, Alert, Text, View } from 'react-native'
import { useState, useRef } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign.js'
import { Dropdown } from 'react-native-element-dropdown'
import { useAuth } from '../../contexts/AuthContext.js'
import { storeData, storeMultipleItems } from '../../utils/AsyncStorage.js'
import { CURRENCY_INFO } from '../../constants/currencyInfo.js'
import { STORAGE_KEYS } from '../../constants/storageKeys.js'
import { useMonobank } from '../../contexts/MonobankContext.js'
import { useTransactions } from '../../contexts/TransactionsContext.js'
const { CARD_NUMBER, CURRENCY_SYMBOL } = STORAGE_KEYS

export const DropdownHomeScreen = () => {
    const { dispatch, updateUser, user } = useAuth()
    const { fetchTransactionsAndTotalSpendings, filters, setGroupedTransactions, setTransactions, setTotalSpendings } = useTransactions()
    const { dropdownData, setCardNumber, setCurrencySymbol } = useMonobank()
    const [value, setValue] = useState(null)
    const [isFocus, setIsFocus] = useState(false)
    const ref = useRef(null)

    const confirmOnPressHandler = async (item) => {
        const { accountId, value, label } = item
        await storeData(CURRENCY_SYMBOL, CURRENCY_INFO.symbols[label])

        dispatch({
            type: 'SET_APP_STATE', payload: {
                user: {
                    ...user,
                    defaultAccount: accountId
                }
            }
        })
        await updateUser({ defaultAccount: accountId })

        const { data, totalSpendings } = await fetchTransactionsAndTotalSpendings({
            accountId,
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
        setValue(value)
        setCardNumber(value)
        await storeData(CARD_NUMBER, value)
        // setDefaultAccount(accountId)
        await storeData(STORAGE_KEYS.CURRENCY_SYMBOL, CURRENCY_INFO.symbols[label])
        setCurrencySymbol(CURRENCY_INFO.symbols[label])
    }

    if (!dropdownData || dropdownData.length === 0) {
        return <Text>No cards available</Text> // Fallback if no data is available
    }

    const renderItem = item => (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            <Text style={styles.icon} size={20} color={isFocus ? 'blue' : 'black'} marginRight={10}>{item.value}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dropdownData} // Use the passed dropdownData
                maxHeight={300}
                labelField='value'
                valueField='value'
                placeholder={!isFocus ? 'Select card' : '...'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value)
                    setIsFocus(false)
                }}
                renderLeftIcon={() => (
                    <AntDesign name='Safety' size={20} color={isFocus ? 'blue' : '#a1a1a1'} marginRight={10} />
                )}
                renderItem={renderItem}
                confirmSelectItem
                onConfirmSelectItem={(item) => {
                    Alert.alert('Card Confirmation', 'Do you want to select this card?', [
                        { text: 'Cancel', onPress: () => { } },
                        { text: 'Confirm', onPress: () => confirmOnPressHandler(item) }
                    ])
                }}
                ref={ref}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
        color: '#a1a1a1'
    },
    icon: {
        marginRight: 5,
        color: '#a1a1a1'
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    dropdown: {
        margin: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#a1a1a1'
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    }
})