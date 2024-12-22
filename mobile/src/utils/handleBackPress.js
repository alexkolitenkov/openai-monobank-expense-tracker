import { Alert, BackHandler } from 'react-native'

export const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
        },
        {
            text: 'Exit',
            onPress: () => BackHandler.exitApp(),
        },
    ])
    return true
}