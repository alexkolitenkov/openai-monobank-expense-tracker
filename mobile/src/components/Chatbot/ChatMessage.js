// import Colors from '@/constants/Colors';
// import { copyImageToClipboard, downloadAndSaveImage, shareImage } from '@/utils/Image';
// import { Link } from 'expo-router';
import { View, Text, StyleSheet, Image, ActivityIndicator, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Role } from '../../constants/enums';
// import * as ContextMenu from 'zeego/context-menu';

const ChatMessage = ({
    content,
    role,
    imageUrl,
    prompt,
    loading,
}) => {


    return (
        <View style={styles.row}>
            {role === Role.Bot ? (
                <View style={[styles.item, { backgroundColor: '#fff' }]}>
                    <Image source={require('./../../assets/images/generic/logo-dark.png')} style={styles.btnImage} />
                </View>
            ) : (
                <View style={[styles.avatar]}>
                    <AntDesign name='user' size={16} color='#000' style={styles.btnImage} />
                </View>
            )}

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator color='#20AB6E' size="small" />
                </View>
            ) : (
                <>
                    <Text style={styles.text}>{content}</Text>
                </>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 14,
        gap: 14,
        marginVertical: 12,
    },
    item: {
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        justifyContent: 'center', // Centers content vertically
        alignItems: 'center',     // Centers content horizontally
    },
    btnImage: {
        margin: 6, // Optional, adjust as needed
        height: 16,
        width: 16
    },    
    text: {
        padding: 4,
        fontSize: 16,
        flexWrap: 'wrap',
        flex: 1,
        color: '#000'
    },
    previewImage: {
        width: 240,
        height: 240,
        borderRadius: 10,
    },
    loading: {
        justifyContent: 'center',
        height: 26,
        marginLeft: 14,
    },
});
export default ChatMessage;