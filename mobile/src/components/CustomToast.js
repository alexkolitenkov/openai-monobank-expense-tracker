import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: 'green',
                borderLeftwidth: 7,
                width: '90%',
                height: 70,
                borderRightColor: 'green',
                borderRightwidth: 7,
            }}
            contentContainerstyle={{
                paddingHorizontal: 15
            }}
            text1style={{
                fontSize: 17,
                fontweight: '700',
            }}
            text2style={{
                fontSize: 14,
            }}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            text2NumberOfLines={3}
            style={{
                borderLeftColor: 'red',
                borderLeftwidth: 7,
                width: '90%',
                height: 70,
                borderRightColor: 'red',
                borderRightWidth: 7,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15
            }}
            text1style={{
                fontSize: 17,
                fontWeight: '700'
            }}
            text2style={{
                fontSize: 14,
            }}
        />
    ),
}

const CustomToast = () => {
    return (
        <Toast config={toastConfig} />
    )
}

export default CustomToast