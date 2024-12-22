import { StyleSheet, View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons.js'
import { DateTime } from 'luxon'
import { useMonobank } from '../../contexts/MonobankContext'
import { useTransactions } from '../../contexts/TransactionsContext'
import { useAuth } from '../../contexts/AuthContext' 

export const HomeHeader = () => {
    const { currencySymbol } = useMonobank()
    const { filters, totalSpendings } = useTransactions()
    const { user } = useAuth()
    
    const { income: totalIncome, expenses: totalExpenses } = totalSpendings

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.month}>{
                    DateTime.fromObject({year: filters.year, month: filters.month, day: 1}).toFormat('MMMM, yyyy')
                }</Text>
            </View>

            <View style={styles.summary}>
                <View style={styles.income}>
                    <Ionicons name='wallet-outline' size={24} color='#fff' />
                    <Text style={styles.summaryText}>Income</Text>
                    <Text style={styles.summaryAmount}>{`${totalIncome / 100}${user?.defaultAccount ? currencySymbol : '₴'}`}</Text>
                </View>
                <View style={styles.expenses}>
                    <Ionicons name='card-outline' size={24} color='#fff' />
                    <Text style={styles.summaryText}>Expenses</Text>
                    <Text style={styles.summaryAmount}>{`${Math.abs(totalExpenses) / 100}${user?.defaultAccount ? currencySymbol : '₴'}`}</Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    month: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4b6584',
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    income: {
        flex: 1,
        backgroundColor: '#00A86B',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    summaryText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 10,
    },
    summaryAmount: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 5,
    },
    expenses: {
        flex: 1,
        backgroundColor: '#FD3C4A',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
    },
})