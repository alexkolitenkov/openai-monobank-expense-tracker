import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import CustomToast from '../components/CustomToast.js'
import MainStackNavigator from './MainStackNavigator.js'
import { AuthProvider } from '../contexts/AuthContext.js'
import { MonobankProvider } from '../contexts/MonobankContext.js'
import { TransactionsProvider } from '../contexts/TransactionsContext.js'

const MainNavigator = () => {
    return (
        <AuthProvider>
            <MonobankProvider>
                <TransactionsProvider>
                    <NavigationContainer>
                        <MainStackNavigator />
                        <CustomToast />
                    </NavigationContainer>
                </TransactionsProvider>
            </MonobankProvider>
        </AuthProvider>
    )
}

export default MainNavigator
