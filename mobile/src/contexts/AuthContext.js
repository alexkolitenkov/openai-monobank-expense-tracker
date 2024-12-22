import React, { useContext, createContext, useReducer, useEffect, useMemo, useCallback } from 'react'
import apiFactory from '../api/apiSingleton'
import { getData, storeData, getMultipleItems, clearAllData } from '../utils/AsyncStorage.js'
import { STORAGE_KEYS } from '../constants/storageKeys'
import CustomActivityIndicator from '../components/CustomActivityIndicator'
import SplashScreen from 'react-native-splash-screen'
import { ROUTES } from '../constants/routes.js'

const AuthContext = createContext()

const initialAuthState = {
    user: null,
    isAppFirstLaunched: null,
    isLoggedIn: false,
    isLoading: true,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_APP_STATE':
            return { ...state, ...action.payload }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        default:
            return state
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialAuthState)

    useEffect(() => {
        const checkAppState = async () => {
            try {
                const profile = await apiFactory.profile.show()
                let isAppFirstLaunched = await getData(STORAGE_KEYS.IS_APP_FIRST_LAUNCHED)
                if (isAppFirstLaunched === null) {
                    await storeData(STORAGE_KEYS.IS_APP_FIRST_LAUNCHED, false)
                    isAppFirstLaunched = false
                }
    
                dispatch({
                    type: 'SET_APP_STATE',
                    payload: { user: profile, isLoggedIn: !!profile, isAppFirstLaunched },
                })
            } catch (error) {
                console.log('Error checking app state:', error)
                await clearAllData()
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }
    
        checkAppState()
        SplashScreen.hide()
    }, [])
    
    const initialRouteName = useMemo(() => {
        if (state.isAppFirstLaunched) {
            return ROUTES.ONBOARDING
        }
        if (state.isLoggedIn) {
            return state.user?.isTokenSaved ? ROUTES.DRAWER : ROUTES.ACCOUNT_CONNECT
        }
        return ROUTES.SIGNIN
    }, [state.isAppFirstLaunched, state.isLoggedIn, state.user?.isTokenSaved])

    const login = useCallback(async ({ email, password }) => {
        const { user } = await apiFactory.session.login({ email, password })
        dispatch({
            type: 'SET_APP_STATE',
            payload: {
                user,
                isLoggedIn: true,
                isAppFirstLaunched: false
            }
        })
        await storeData(STORAGE_KEYS.USER_INFO, user)
        return user
    }, [])

    const logout = useCallback(async () => {
        await apiFactory.session.logout()
        dispatch({
            type: 'SET_APP_STATE',
            payload: {
                user: null,
                isLoggedIn: false
            }
        })
        await clearAllData()
    }, [])

    const value = useMemo(() => ({
        user: state.user,
        login,
        logout,
        initialRouteName,
        dispatch,
        isLoading: state.isLoading,
        updateUser: apiFactory.profile.update,
        isLoggedIn: state.isLoggedIn
    }), [state.user, login, logout, apiFactory.profile.update, initialRouteName, state.isLoading, state.isLoggedIn])

    if (state.isLoading) {
        return <CustomActivityIndicator />
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
