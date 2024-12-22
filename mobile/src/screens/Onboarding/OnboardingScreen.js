import React from 'react'
import { StyleSheet, Text, View, Image, useWindowDimensions } from "react-native"
import OnboardingButton from '../../components/CustomButton.js'
import CatImage from './../../assets/images/Onboarding/front-cat.png'
import OnboardingFooter from '../../components/CustomFooter.js'
import { ROUTES } from '../../constants/routes.js'

const { SIGNUP, SIGNIN } = ROUTES

const OnboardingScreen = ({ navigation }) => {
    const { height } = useWindowDimensions()

    return (
        <View style={styles.root}>
            <Image
                source={CatImage}
                style={[styles.catImage, { height: height * 0.5 }]}
                resizeMode='contain' />
            <Text style={styles.heroText}>
                {`Spend Smarter\nSave More`}
            </Text>
            <OnboardingButton
                text='Get Started'
                page='ONBOARDING'
                onPress={() => navigation.replace(SIGNUP)}
            />
            <OnboardingFooter
                messageText='Already Have an Account?'
                page='ONBOARDING'
                type='TERTIARY'
                buttonText='Sign In'
                navigationReplace={SIGNIN}
                navigation={navigation} />
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
    catImage: {
        maxWidth: 300,
        maxHeight: 500
    },
    heroText: {
        fontSize: 40,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#232423'
    },
})

export default OnboardingScreen