import React, { useMemo } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Onboarding from '../screens/Onboarding/OnboardingScreen.js'
import Signup from '../screens/Signup/SignupScreen.js'
import Signin from '../screens/Signin/SigninScreen.js'
import Activation from '../screens/Activation/ActivationScreen.js'
import AccountConnect from '../screens/Account/AccountConnectScreen.js'
import DrawerNavigator from './DrawerNavigator.js'
import { useAuth } from '../contexts/AuthContext.js'
import { ROUTES } from '../constants/routes.js'

const Stack = createStackNavigator()
const MainStackNavigator = () => {
    const { initialRouteName } = useAuth()

    return (
        <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
            <Stack.Screen name={ROUTES.SIGNUP} component={Signup} />
            <Stack.Screen name={ROUTES.SIGNIN} component={Signin} />
            <Stack.Screen name={ROUTES.ACTIVATION} component={Activation} />
            <Stack.Screen name={ROUTES.ACCOUNT_CONNECT} component={AccountConnect} />
            <Stack.Screen name={ROUTES.DRAWER} component={DrawerNavigator}/>
        </Stack.Navigator>
    )
}

export default MainStackNavigator
