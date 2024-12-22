import { Text, StyleSheet, Pressable, Animated } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'

const CustomButton = ({ text, onPress, type = 'PRIMARY', page, style }) => {
    const animated = new Animated.Value(1)

    const fadeIn = () => {
        Animated.timing(animated, {
            toValue: 0.4,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }

    const containerStyle = [
        styles.container,
        page && type && styles[`container_${page}_${type}`],
        { ...style }
    ]

    const textStyle = [
        styles.text,
        page && type && styles[`text_${page}_${type}`],
    ]

    return (
        <Pressable
            onPress={onPress}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={containerStyle}
        >
            <Animated.View style={{ opacity: animated }}>
                {type !== 'TERTIARY' &&
                    <DropShadow style={styles.boxShadow}>
                        <LinearGradient colors={['#878a88', '#232423']} style={styles.linearGradient}>
                            <Text style={textStyle}>{text}</Text>
                        </LinearGradient>
                    </DropShadow>
                }
                {type === 'TERTIARY' && <Text style={[textStyle, { textDecorationLine: 'underline' }]}>{text}</Text>}
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
    },

    linearGradient: {
        borderRadius: 25,
        padding: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },

    text: {
        textAlign: 'center',
    },

    boxShadow: {
        shadowColor: "#878a88",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },

    // ONBOARDING
    container_ONBOARDING_PRIMARY: {
        paddingVertical: 17.5,
        borderRadius: 25,
        width: '100%'
    },

    text_ONBOARDING_PRIMARY: {
        color: 'white',
        fontWeight: 600
    },

    text_ONBOARDING_TERTIARY: {
        color: '#232423',
        fontWeight: 600
    },

    // SIGNIN
    container_SIGNIN_PRIMARY: {
        paddingVertical: 17.5,
        borderRadius: 25,
        width: '100%'
    },

    text_SIGNIN_PRIMARY: {
        color: 'white',
        fontWeight: 600

    },

    // SIGNUP
    container_SIGNUP_PRIMARY: {
        paddingVertical: 17.5,
        borderRadius: 25,
        width: '100%'
    },
    text_SIGNUP_PRIMARY: {
        color: 'white',
        fontWeight: 600
    },

    // ACTIVATION
    container_ACTIVATION_PRIMARY: {
        paddingVertical: 17.5,
        borderRadius: 25,
        width: '100%'
    },

    text_ACTIVATION_PRIMARY: {
        color: 'white',
        fontWeight: 600
    },

    // ACCOUNT-CONNECT
    container_ACCOUNTCONNECT_PRIMARY: {
        paddingVertical: 17.5,
        borderRadius: 25,
        width: '100%'
    },

    text_ACCOUNTCONNECT_PRIMARY: {
        color: 'white',
        fontWeight: 600

    },
})

export default CustomButton
