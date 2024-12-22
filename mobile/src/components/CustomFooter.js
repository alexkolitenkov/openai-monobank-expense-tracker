import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const CustomFooter = ({
    navigation,
    messageText,
    buttonText,
    navigationReplace,
    page,
    type
}) => {
    return (
        <View style={styles.spanButton}>
            <Text style={styles.spanText}>{messageText}</Text>
            <CustomButton
                text={buttonText}
                type={type}
                page={page}
                onPress={() => navigation.replace(navigationReplace)}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    spanButton: {
        flexDirection: 'row',
        alignItems: 'center', // Align items in the row center
    },
    spanText: {
        marginEnd: 5,
        color: 'black'
    }
})
export default CustomFooter