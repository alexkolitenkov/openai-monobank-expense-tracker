import React, { useCallback } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { IconProvider } from '../IconProvider'
import { useMonobank } from '../../contexts/MonobankContext'
import { useTransactions } from '../../contexts/TransactionsContext'

const TransactionItem = React.memo(({ item, currencySymbol }) => (
    <View style={styles.transaction}>
        <View style={styles.transactionIcon}>
            <IconProvider mccCode={item.mcc} />
        </View>
        <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{item.description || item.comment}</Text>
            <Text style={styles.transactionSubtitle}>{new Date(item.time).toLocaleDateString()}</Text>
        </View>
        <Text
            style={[
                styles.transactionAmount,
                { color: item.type === 'ACCRUAL' ? '#00A86B' : '#ff4757' },
            ]}
        >
            {`${item.amount / 100}${currencySymbol}`}
        </Text>
    </View>
))

export const TransactionList = () => {
    const { transactions } = useTransactions()
    const { currencySymbol } = useMonobank()

    const renderTransaction = useCallback(({ item }) => (
        <TransactionItem item={item} currencySymbol={currencySymbol} />
    ), [currencySymbol])

    if (!transactions || transactions.length === 0) {
        return (
            <View style={styles.transactionsBlock}>
                <Text style={{color: '#000'}}>No transactions</Text>
            </View>
        )
    }

    return (
        <View style={styles.transactionsBlock}>
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10} // Initial number of items to render
                maxToRenderPerBatch={10} // Controls batch rendering
                windowSize={10} // Number of items rendered outside of the viewable area
            />
        </View>
    )
}

const styles = StyleSheet.create({
    transactionsBlock: {
        marginVertical: 20,
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    transactionIcon: {
        backgroundColor: '#f1f2f6',
        padding: 10,
        borderRadius: 50,
    },
    transactionDetails: {
        flex: 1,
        marginLeft: 15,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4b6584',
    },
    transactionSubtitle: {
        fontSize: 14,
        color: '#a4b0be',
        marginTop: 5,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff4757',
    }
})