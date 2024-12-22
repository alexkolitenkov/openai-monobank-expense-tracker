import { openai, chatStream } from '../../openai/openai'
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useTransactions } from '../../contexts/TransactionsContext'
import Tooltip from './AdviceModal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useMonobank } from '../../contexts/MonobankContext'

const FinancialAdvice = () => {
    const { totalSpendings, groupedTransactions, filters } = useTransactions()
    const { income: totalIncome, expenses: totalExpenses } = totalSpendings
    const [financialAdvice, setFinancialAdvice] = useState('')
    const [showTooltip, setShowTooltip] = useState(false)
    const { currencySymbol } = useMonobank()

    // Process data
    const categoryExpenses = Object.entries(groupedTransactions).map(([key, value]) => {
        const { transactions, categoryTotalSpendings } = value

        // Format categoryTotalSpendings by dividing by 100 and adding the currency symbol
        const formattedCategoryTotalSpendings = Object.fromEntries(
            Object.entries(categoryTotalSpendings).map(([field, amount]) => [
                field,
                `${currencySymbol}${(amount / 100).toFixed(2)}`
            ])
        )

        return {
            [key]: { categoryTotalSpendings: formattedCategoryTotalSpendings }
        }
    })

    const categoryExpensesStringified = JSON.stringify(categoryExpenses)

    const transactionsPrompt = `
Based on the following financial data:
- Expenses: ${totalExpenses} ${currencySymbol} 
- Incomes: ${totalIncome} ${currencySymbol} 
Provide detailed financial advice in 2 sentence to help the user manage their finances more effectively.
`

    const categoriesPrompt = `
Based on the following financial data: 
- Categories Expenses: ${categoryExpensesStringified} ${currencySymbol} 
Provide detailed financial advice to help the user manage their finances more effectively.
`

    useEffect(() => {
        openai.chat.addListener('onChatMessageReceived', (payload) => {
            setFinancialAdvice((message) => {
                const newMessage = payload.choices[0]?.delta.content
                if (newMessage) {
                    return message + newMessage
                }
                return message
            })
        })

        if (showTooltip) {
            if (filters.isGrouped) {
                chatStream(categoriesPrompt)
            } else {
                chatStream(transactionsPrompt)
            }
        }

        return () => {
            openai.chat.removeListener('onChatMessageReceived')
        }
    }, [showTooltip, totalSpendings, openai])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    setFinancialAdvice('')
                    setShowTooltip(!showTooltip)
                }}
                style={styles.toggleButton}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name='tips-and-updates' size={24} color='#4b6584' />
                </View>

            </TouchableOpacity>
            <Tooltip
                visible={showTooltip}
                onClose={() => {
                    setFinancialAdvice('')
                    setShowTooltip(false)
                }}
                content={financialAdvice || <ActivityIndicator size="large" color="#232423" />}
            />
        </View>
    )
}

export default FinancialAdvice

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: '#f1f2f6',
        padding: 10,
        borderRadius: 50,
        shadowColor: '#4b6584',
        shadowOffset: { width: 4, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 2,
    },
    toggleButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        zIndex: 100,
    },
    container: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        zIndex: 100,
    }
})
