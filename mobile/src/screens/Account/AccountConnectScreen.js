import { StyleSheet, Text, View, BackHandler, Linking, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { getResponseError } from '../../utils/errorUtils/getResponseError.js'
import { handleChange } from '../../utils/handleChange.js'
import { setErrorMessage } from '../../utils/errorUtils/setErrorMessage.js'
import { ROUTES } from '../../constants/routes.js'
import { useMonobank } from '../../contexts/MonobankContext.js'
import { useAuth } from '../../contexts/AuthContext.js'
import { handleBackPress } from '../../utils/handleBackPress.js'
import Ionicons from 'react-native-vector-icons/Ionicons'

import AccountConnectHeader from '../../components/CustomHeader.js'
import AccountConnectButton from '../../components/CustomButton.js'
import AccountConnectInput from '../../components/CustomInput.js'
import AccountConnectActivityIndicator from '../../components/CustomActivityIndicator.js'

const { DRAWER } = ROUTES

const AccountConnectScreen = ({ navigation }) => {
    const [data, setData] = useState({})
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false)
    const [errors, setErrors] = useState({})
    const { connect, apiMonobankUrl } = useMonobank()
    const { updateUser, logout } = useAuth()

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress)

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
            }
        })
    )

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to Sign out?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    setShowLoadingIndicator(true)

                    await logout()
                    navigation.replace(ROUTES.SIGNIN)
                    setShowLoadingIndicator(false)

                }
            },
        ])
        return true
    }

    const sendToken = async () => {
        setShowLoadingIndicator(true)
        setErrors({})

        if (!data.token) {
            setErrors(getResponseError({ token: 'REQUIRED' }))
            setShowLoadingIndicator(false)
            return
        }

        try {
            await connect(data.token)
            await updateUser({ isTokenSaved: 1 })
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Token was saved.'
            })
            setTimeout(() => {
                Toast.hide()
                navigation.replace(DRAWER)
            }, 1000)
        } catch (err) {
            setErrors(getResponseError(err))
        } finally {
            setShowLoadingIndicator(false)
        }
    }

    return (
        <View style={styles.root}>
            {showLoadingIndicator && <AccountConnectActivityIndicator />}
            <AccountConnectHeader style={styles.header} text='Account Connect' />
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    To use the app, you need to log in to your personal account at{' '}
                    <Text
                        style={styles.link}
                        onPress={async () => {
                            try {
                                await Linking.openURL(apiMonobankUrl)
                            } catch (error) {
                                console.error('error:', error)
                                Toast.show({
                                    type: 'error',
                                    text1: 'Failed Loading',
                                })
                            }
                        }}
                    >
                        {apiMonobankUrl}
                    </Text>
                    {' '}and receive a token for personal use.
                </Text>
            </View>
            <AccountConnectInput
                placeholder='Token'
                value={data.token}
                setValue={(value) => handleChange('token', value, setData)}
                editable={!showLoadingIndicator}
                errorMessage={errors?.token}
                inputName='token'
                setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
                secureTextEntry
            />
            <AccountConnectButton
                text='Connect'
                page='ACCOUNTCONNECT'
                onPress={sendToken}
                disabled={showLoadingIndicator}
            />
            <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                    handleLogout()
                }}>
                    <Ionicons name='log-out-outline' size={24} color='#000' />
                    <Text style={styles.logoutText} >Sign out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AccountConnectScreen

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        marginBottom: 20,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    infoText: {
        textAlign: 'center',
        color: '#000',
        marginBottom: 10,
    },
    link: {
        color: '#232423',
        textDecorationLine: 'underline',
    },
    logoutSection: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        padding: 20,
        flexDirection: 'row'
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'center',
    }
})