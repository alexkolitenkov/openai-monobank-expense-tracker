import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ROUTES } from '../../constants/routes.js'
import { getResponseError } from '../../utils/errorUtils/getResponseError.js'
import { setErrorMessage } from '../../utils/errorUtils/setErrorMessage.js'
import { handleChange } from '../../utils/handleChange.js'
import { DATA_KEYS } from '../../constants/dataKeys.js'

import SigninActivityIndicator from '../../components/CustomActivityIndicator.js'
import SigninButton from '../../components/CustomButton.js'
import SigninFooter from '../../components/CustomFooter.js'
import SigninHeader from '../../components/CustomHeader.js'
import SigninInput from '../../components/CustomInput.js'
import { useAuth } from '../../contexts/AuthContext.js'

const { ACCOUNT_CONNECT, ONBOARDING, SIGNUP, DRAWER } = ROUTES
const { EMAIL, PASSWORD } = DATA_KEYS

const SigninScreen = ({ navigation }) => {
    const [data, setData] = useState({})
    const [errors, setErrors] = useState({})
    const { login } = useAuth()
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false)

    const signin = async () => {
        setShowLoadingIndicator(true)
        setErrors({})

        try {
            const user = await login({
                email: data.email ? data.email : '',
                password: data.password ? data.password : ''
            })
            user.isTokenSaved
                ? navigation.replace(DRAWER)
                : navigation.replace(ACCOUNT_CONNECT)
        } catch (err) {
            console.log({ err })
            setErrors(getResponseError(err))
        } finally {
            setShowLoadingIndicator(false)
        }
    }

    return (
        <View style={styles.root}>
            {showLoadingIndicator && <SigninActivityIndicator />}
            <SigninHeader
                style={styles.header}
                text='Sign In'
                onPress={() => navigation.replace(ONBOARDING)}
                iconButtonTrue
            />
            <SigninInput
                placeholder='Email'
                value={data.email}
                setValue={(value) => handleChange(EMAIL, value, setData)}
                editable={!showLoadingIndicator}
                errorMessage={errors?.email}
                inputName={EMAIL}
                setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
            />
            <SigninInput
                placeholder='Password'
                value={data.password}
                setValue={(value) => handleChange(PASSWORD, value, setData)}
                secureTextEntry
                editable={!showLoadingIndicator}
                errorMessage={errors?.password}
                inputName={PASSWORD}
                setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
            />
            <SigninButton
                text='Sign In'
                page='SIGNIN'
                style={styles.signinButton}
                onPress={signin}
                disabled={showLoadingIndicator}
            />
            <SigninFooter
                messageText={`Don't have an account yet?`}
                page='ONBOARDING'
                type='TERTIARY'
                buttonText='Sign Up'
                navigationReplace={SIGNUP}
                navigation={navigation}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 50,
    },
    signinButton: {
        marginVertical: 10,
    },
})

export default SigninScreen