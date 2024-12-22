import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { IconProvider } from '../IconProvider'
import { isObjectEmpty } from '../../utils/helpers'
import { useMonobank } from '../../contexts/MonobankContext'
import { useTransactions } from '../../contexts/TransactionsContext'

export const ExpensesByCategory = () => {
    const { groupedTransactions } = useTransactions()
    const { currencySymbol } = useMonobank()
    if (isObjectEmpty(groupedTransactions)) {
        return (
            <View style={styles.categoriesBlock}>
                <Text style={{color: '#000'}}>No categories</Text>
            </View>
        )
    }

    const renderCategory = ({ item }) => (
        <View style={styles.categoryContainer}>
            <View style={styles.transactionIcon}>
                <IconProvider category={item[0]} />
            </View>
            <Text style={styles.categoryTitle}>{item[0]}</Text>
            <View style={[styles.totalSpendings]}>
                <Text style={[styles.income]}>
                    {item[1]?.categoryTotalSpendings?.income !== undefined ?
                        (item[1].categoryTotalSpendings.income / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'}{currencySymbol}
                </Text>
                <Text style={[styles.expenses]}>
                    {item[1]?.categoryTotalSpendings?.expenses !== undefined ?
                        (item[1].categoryTotalSpendings.expenses / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0.00'}{currencySymbol}
                </Text>
            </View>

        </View>
    )

    return (
        <View style={styles.categoriesBlock}>
            <FlatList
                data={Object.entries(groupedTransactions || {})}
                renderItem={renderCategory}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    categoriesBlock: {
        marginVertical: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4b6584',
        flex: 1, // Ensures the text takes up available space
        marginLeft: 15,
    },
    transactionIcon: {
        backgroundColor: '#f1f2f6',
        padding: 10,
        borderRadius: 50,
    },
    totalSpendings: {},
    income: {
        color: 'green',
        color: '#00A86B',
        fontWeight: 'bold',
        textAlign: 'right', // Align the amount to the right
    },
    expenses: {
        color: 'red',
        color: '#ff4757',
        fontWeight: 'bold',
        textAlign: 'right', // Align the amount to the right
    }
})
