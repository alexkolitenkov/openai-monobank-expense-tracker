import Colors from './../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { View, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';

const MessageInput = ({ onShouldSend }) => {
    const [message, setMessage] = useState('');
    const disabled = message.length === 0
    const inputRef = useRef(null);

    const onChangeText = (text) => {
        setMessage(text);
    };

    const onSend = () => {
        onShouldSend(message);
        setMessage('');
    };

    const onSelectCard = (text) => {
        onShouldSend(text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TextInput
                    // autoFocus
                    ref={inputRef}
                    placeholder="Message"
                    placeholderTextColor={Colors.greyLight}
                    style={styles.messageInput}
                    onChangeText={onChangeText}
                    value={message}
                    multiline
                />

                <TouchableOpacity onPress={onSend} disabled={disabled} style={styles.messageSendButton}>
                    <Ionicons name="arrow-up-circle" size={36} color={disabled ? Colors.sky : Colors.greyLight} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 0
    },
    row: {
        borderColor: Colors.input,
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000
    },
    messageSendButton: {
        padding: 10
    },
    messageInput: {
        flex: 1,
        marginHorizontal: 10,
        color: Colors.dark,
    },
    roundBtn: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: Colors.input,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
});
export default MessageInput;