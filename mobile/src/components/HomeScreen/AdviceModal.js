import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Modal,
    ScrollView,
} from 'react-native';
import CustomButton from '../CustomButton';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ROUTES } from '../../constants/routes';

const AdviceModal = ({ visible, onClose, content }) => {
    const navigation = useNavigation();
    const [modalOpacity] = useState(new Animated.Value(0)); // For fade-in/out effect

    useEffect(() => {
        if (visible) {
            // Fade in when modal becomes visible
            Animated.timing(modalOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Fade out when modal becomes invisible
            Animated.timing(modalOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { opacity: modalOpacity },
                    ]}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <AntDesign
                            name="questioncircleo"
                            size={24}
                            color="#f6b93b"
                            style={styles.icon}
                        />
                        <Text style={styles.modalText}>{content}</Text>
                        <CustomButton
                            text="Ask our AI Advisor"
                            page={ROUTES.CHATBOT}
                            type="TERTIARY"
                            style={styles.redirectButton}
                            onPress={() => {
                                navigation.navigate(ROUTES.CHATBOT);
                            }}
                        />
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default AdviceModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: Dimensions.get('window').width * 0.9,
        maxHeight: Dimensions.get('window').height * 0.7,
        backgroundColor: '#f1f2f6',
        borderRadius: 15,
        padding: 20,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: {
        color: '#4b6584',
        fontSize: 16,
        marginVertical: 10,
        fontFamily: 'Arial',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 18,
        color: '#333',
    },
    redirectButton: {
        padding: 10,
        backgroundColor: '#424e5c',
    },
    icon: {
        marginBottom: 10,
    },
});
