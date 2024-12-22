import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'

const CustomHeader = ({ style, text, onPress, iconButtonTrue }) => {
    return (
        <View style={[styles.container, {...style}]}>
            { iconButtonTrue && <Pressable onPress={onPress} style={styles.leftIcon}>
                <Icon name="arrow-left-long" size={25} color='black' />
            </Pressable>}
            <Text style={styles.headerText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 60,
    },
    leftIcon: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    headerText: {
        fontSize: 20,
        color: 'black',
        fontWeight: '500'
    },
})

export default CustomHeader