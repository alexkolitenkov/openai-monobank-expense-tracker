import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { getResponseError } from '../../utils/errorUtils/getResponseError.js'
import { handleChange } from '../../utils/handleChange.js'
import { setErrorMessage } from '../../utils/errorUtils/setErrorMessage.js'
import apiFactory from '../../api/apiSingleton.js'
import { ROUTES } from '../../constants/routes.js'
import { DATA_KEYS } from '../../constants/dataKeys.js'

import SignupInput from '../../components/CustomInput.js'
import SignupHeader from '../../components/CustomHeader.js'
import SignupButton from '../../components/CustomButton.js'
import SignupFooter from '../../components/CustomFooter.js'
import SignupActivityIndicator from '../../components/CustomActivityIndicator.js'

const { ACTIVATION, ONBOARDING, SIGNIN } = ROUTES
const { NAME, EMAIL, PASSWORD } = DATA_KEYS

const SignupScreen = ({ navigation }) => {
    const [data, setData] = useState({})
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false)
    const [errors, setErrors] = useState({})

    const createUser = async () => {
        setShowLoadingIndicator(true)
        setErrors({})

        try {
            await apiFactory.session.registration({
                name: data.name ? data.name : '',
                email: data.email ? data.email : '',
                password: data.password ? data.password : ''
            })
            navigation.replace(ACTIVATION)
        } catch (err) {
            setErrors(getResponseError(err))
        } finally {
            setShowLoadingIndicator(false)
        }
    }

    return (
        <View style={styles.root}>
            {showLoadingIndicator && (
                <SignupActivityIndicator />
            )}
            <SignupHeader
                style={styles.header}
                text='Sign Up'
                onPress={() => navigation.replace(ONBOARDING)}
                iconButtonTrue
            />
            <View style={styles.formContainer}>
                <SignupInput
                    placeholder='Name'
                    value={data.name}
                    setValue={(value) => handleChange(NAME, value, setData)}
                    editable={!showLoadingIndicator}
                    errorMessage={errors?.name}
                    inputName={NAME}
                    setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
                />
                <SignupInput
                    placeholder='Email'
                    value={data.email}
                    setValue={(value) => handleChange(EMAIL, value, setData)}
                    editable={!showLoadingIndicator}
                    errorMessage={errors?.email}
                    inputName={EMAIL}
                    setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
                />
                <SignupInput
                    placeholder='Password'
                    value={data.password}
                    setValue={(value) => handleChange(PASSWORD, value, setData)}
                    secureTextEntry
                    editable={!showLoadingIndicator}
                    errorMessage={errors?.password}
                    inputName={PASSWORD}
                    setErrorMessage={(inputName, errorMessage) => setErrorMessage(inputName, errorMessage, setErrors)}
                />
                <SignupButton
                    text='Sign Up'
                    page='SIGNUP'
                    style={styles.signupButton}
                    onPress={createUser}
                    disabled={showLoadingIndicator}
                />
            </View>
            <SignupFooter
                messageText='Already Have an Account?'
                page='ONBOARDING'
                type='TERTIARY'
                buttonText='Sign In'
                navigationReplace={SIGNIN}
                navigation={navigation}
            />
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
        marginBottom: 50
    },
    formContainer: {
        width: '100%',
    },
    signupButton: {
        marginVertical: 10
    }
})

export default SignupScreen
