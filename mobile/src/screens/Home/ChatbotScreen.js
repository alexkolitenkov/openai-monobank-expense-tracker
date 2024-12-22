import { StyleSheet, Image, View, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Role } from '../../constants/enums'
import MessageInput from '../../components/Chatbot/MessageInput'
import ChatMessage from '../../components/Chatbot/ChatMessage'
import MessageIdeas from '../../components/Chatbot/MessageIdeas'
import { FlashList } from '@shopify/flash-list'
import { openai, chatStream } from '../../openai/openai'
import { useAuth } from '../../contexts/AuthContext'
import { useTransactions } from '../../contexts/TransactionsContext'
import { useMonobank } from '../../contexts/MonobankContext'

const ChatbotScreen = () => {
    const { user } = useAuth()
    const { filters, fetchAllData, totalSpendings } = useTransactions()
    const { currencySymbol } = useMonobank()
    const [height, setHeight] = useState(0)
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState('')

    useEffect(() => {
        const loadPrompt = async () => {
            const { transactions, categories } = await fetchAllData({
                year: filters.year,
                month: filters.month,
                accountId: user?.defaultAccount
            })

            // TODO: remove 'description' and 'mcc' fields from transactions if too much tokens are used
            const transactionsEssentialData = transactions.map((tx) => ({
                time: tx.time,
                description: tx.description,
                mcc: tx.mcc,
                amount: `${tx.amount / 100}${currencySymbol}`
            }))

            for (const [category, value] of Object.entries(categories)) {
                categories[category].categoryTotalSpendings.income = categories[category].categoryTotalSpendings.income / 100
                categories[category].categoryTotalSpendings.expenses = categories[category].categoryTotalSpendings.expenses / 100
            }

            setPrompt(`
Answer based only on the information I give you below:
- Year: ${filters.year}
- Month: ${filters.month}
- Income: ${totalSpendings.income / 100}${currencySymbol}
- Expenses: ${totalSpendings.expenses / 100}${currencySymbol}
- Transactions info: ${JSON.stringify(transactionsEssentialData)}
- Catetories info: ${JSON.stringify(categories)}
`)}

        if (user?.defaultAccount) {
            loadPrompt()
        }
    }, [user?.defaultAccount])

    useEffect(() => {
        const handleNewMessage = (payload) => {
            setMessages((messages) => {
                const newMessage = payload.choices[0]?.delta.content
                if (newMessage) {
                    messages[messages.length - 1].content += newMessage
                    return [...messages]
                }

                return messages
            })
        }

        openai.chat.addListener('onChatMessageReceived', handleNewMessage)

        return () => {
            openai.chat.removeListener('onChatMessageReceived')
        }
    }, [openai])

    const getCompletion = async (text) => {
        setMessages([...messages, { role: Role.User, content: text }, { role: Role.Bot, content: '' }])
        if (!prompt)
            chatStream(text)
        else {
            chatStream(prompt + text)
        }
    }

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout
        setHeight(height / 2)
    }

    return (
        <View style={styles.container} onLayout={onLayout}>
            {messages.length == 0 && (
                <View style={[styles.logoContainer, { marginTop: height / 2 }]}>
                    <Image source={require('./../../assets/images/generic/logo-white.png')} style={styles.image} />
                </View>
            )}
            <FlashList
                data={messages}
                renderItem={({ item }) => <ChatMessage {...item} />}
                estimatedItemSize={400}
                contentContainerStyle={{ paddingTop: 30, paddingBottom: 165 }}
                keyboardDismissMode="on-drag"
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                }}>
                <MessageIdeas onSelectCard={getCompletion} />
                <MessageInput onShouldSend={getCompletion} />
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChatbotScreen

const styles = StyleSheet.create({
    logoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#000',
        borderRadius: 50,
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})