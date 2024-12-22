import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import ActivationHeader from '../../components/CustomHeader.js'

const ActivationScreen = () => {
    return (
        <View style={styles.root}>
            <ActivationHeader
                style={styles.header}
                text='Activation Required'
            />
            <Text style={styles.subtitle}>Check your email</Text>
            <Text style={styles.description}>
                We've sent an activation link to your email. Please check your inbox (and your spam folder, just in case) for an email from us.
            </Text>
            <Text style={styles.description}>
                Once you find the email, click the activation link to confirm and activate your account.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF'
    },
    header: {
        marginBottom: 150
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: '#666666',
    },
})

export default ActivationScreen