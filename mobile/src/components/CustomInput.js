import React, { useState } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import CustomFormFieldError from './CustomFormFieldError.js'

const CustomInput = ({
    value,
    setValue,
    placeholder,
    secureTextEntry,
    errorMessage,
    setErrorMessage,
    inputName,
}) => {
    const [hidePassword, setHidePassword] = useState(true)

    const togglePasswordVisibility = () => {
        setHidePassword(!hidePassword)
    }

    const handleChangeText = (text) => {
        setValue(text)
        if (errorMessage) {
            setErrorMessage(inputName, '')
        }
    }

    return (
        <View style={[styles.container, errorMessage && [styles.errorBorder, { marginTop: 15 }]]}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                style={styles.input}
                value={value}
                onChangeText={handleChangeText}
                secureTextEntry={secureTextEntry && hidePassword}
            />
            {secureTextEntry && (
                <TouchableOpacity style={styles.icon} onPress={togglePasswordVisibility}>
                    <Icon name={hidePassword ? 'eye' : 'eye-off'} size={25} color="black" />
                </TouchableOpacity>
            )}
            {errorMessage && <CustomFormFieldError errorMessage={errorMessage} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: '#e8e8e8',
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorBorder: {
        borderColor: '#9e2626',
    },
    input: {
        flex: 1,
        color: '#000'
    },
    icon: {
        padding: 10,
    },
})

export default CustomInput
