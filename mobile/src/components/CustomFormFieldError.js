import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomFormFieldError = ({ errorMessage }) => {
    return (
        <View style={styles.field}>
            <Text style={{ color: '#9e2626' }}>{errorMessage}</Text>
        </View>
    )
}

export default CustomFormFieldError

const styles = StyleSheet.create({
    field: {
        position: 'absolute',
        top: -25,
        left: 15
    }
})