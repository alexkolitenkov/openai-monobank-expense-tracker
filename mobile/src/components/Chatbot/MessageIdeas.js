import Colors from './../../constants/Colors'
import { Text, ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native'

const PredefinedMessages = [
    { title: 'Provide me with statistics', text: "on my income and expenses" },
    { title: 'What day', text: 'did I spend the most?' },
    { title: 'Give an advice', text: "regarding my expenses" },
]

const MessageIdeas = ({ onSelectCard }) => {
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    gap: 16,
                    backgroundColor: Colors.light
                }}>
                {PredefinedMessages.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => onSelectCard(`${item.title} ${item.text}`)}>
                        <Text style={{ color: Colors.grey, fontSize: 16, fontWeight: '500' }}>{item.title}</Text>
                        <Text style={{ color: Colors.grey, fontSize: 14 }}>{item.text}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.input,
        padding: 14,
        borderRadius: 10,
    },
})
export default MessageIdeas