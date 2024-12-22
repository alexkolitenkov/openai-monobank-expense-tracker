import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React from 'react'

const CustomActivityIndicator = ({showLoadingIndicator}) => {
    return (
        <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="#232423" animating={showLoadingIndicator} />
        </View>
    )
}

export default CustomActivityIndicator

const styles = StyleSheet.create({
    activityIndicatorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 2,
    },
})