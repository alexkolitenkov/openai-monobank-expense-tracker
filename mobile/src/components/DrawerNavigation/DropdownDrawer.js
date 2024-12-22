import { StyleSheet, Text, View } from 'react-native'
import { useState, useRef } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { useMonobank } from '../../contexts/MonobankContext.js'
import { useAuth } from '../../contexts/AuthContext.js'
import { handleChange } from '../../utils/handleChange.js'
import { DATA_KEYS } from '../../constants/dataKeys.js'
export const DropdownDrawer = ({ setData }) => {
    const { cardNumber, dropdownData } = useMonobank()
    const { user } = useAuth()
    const [value, setValue] = useState(null)
    const [isFocus, setIsFocus] = useState(false)
    const ref = useRef(null)

    if (!dropdownData || dropdownData.length === 0) {
        return <Text>No cards available</Text>
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
                data={dropdownData}
                maxHeight={300}
                labelField='value'
                valueField='value'
                placeholder={!isFocus ? (user?.defaultAccount ? cardNumber : 'Choose a card') : '...'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    handleChange(DATA_KEYS.DEFAULT_ACCOUNT, item.accountId, setData)
                    setValue(item.value)
                    setIsFocus(false)
                }}
                renderItem={renderItem}
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
    placeholderStyle: {
        color: '#a1a1a1',
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
    selectedTextStyle: {
        color: '#a1a1a1'
    },
})