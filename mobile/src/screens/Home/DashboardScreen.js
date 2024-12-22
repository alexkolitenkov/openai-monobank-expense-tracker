import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTransactions } from '../../contexts/TransactionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useMonobank } from '../../contexts/MonobankContext';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import { DateTime } from 'luxon'

const DashboardScreen = () => {
    const { filters, fetchAllData } = useTransactions();
    const { user } = useAuth()
    const [data, setData] = useState({ transactions: [], categories: {} })
    const [loading, setLoading] = useState(true)
    const { currencySymbol } = useMonobank()

    useEffect(() => {
        const loadData = async () => {
            const { transactions, categories } = await fetchAllData({
                year: filters.year,
                month: filters.month,
                accountId: user?.defaultAccount
            })

            setData({
                transactions,
                categories
            })
            setLoading(false)
        }

        if (filters.year && filters.month && user?.defaultAccount)
            loadData()
    }, [filters.year, filters.month, user?.defaultAccount])


    if (loading) {
        return <CustomActivityIndicator />
    }

    if (!data.transactions || data.transactions.length === 0) {
        return <Text style={styles.noDataText}>No data to display</Text>;
    }

    const expenseData = data.transactions
        .filter((transaction) => {
            const transactionDate = new Date(transaction.time);
            return (
                transaction.amount < 0 &&
                transactionDate.getMonth() + 1 === filters.month &&
                transactionDate.getFullYear() === filters.year
            );
        })
        .map((transaction) => ({
            date: new Date(transaction.time),
            amount: Math.abs(transaction.amount) / 100
        }));

    const firstDay = new Date(filters.year, filters.month - 1, 1);
    const lastDay = new Date(filters.year, filters.month, 0);

    const allDates = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        allDates.push(new Date(d));
    }

    const expensesMap = new Map();
    expenseData.forEach(({ date, amount }) => {
        const dateString = date.toISOString().split('T')[0];
        const existingAmount = expensesMap.get(dateString) || 0;
        expensesMap.set(dateString, existingAmount + amount);

    });
    const cumulativeExpenses = [];
    let cumulativeSum = 0;
    allDates.forEach((date) => {
        const dateString = date.toISOString().split('T')[0];
        const dailyExpense = expensesMap.get(dateString) || 0;
        cumulativeSum += dailyExpense;
        cumulativeExpenses.push({
            date: date,
            value: cumulativeSum,
        });

    });

    const hasData = cumulativeExpenses.some((data) => data.value > 0);
    const lineChartData = hasData
        ? {
            labels: cumulativeExpenses.map((data) => {
                const date = DateTime.fromJSDate(data.date).toFormat('dd/MM')
                return date
            }),
            datasets: [
                {
                    data: cumulativeExpenses.map((data) => data.value),
                },
            ]
        }
        : {
            labels: ['No Data'],
            datasets: [
                {
                    data: [0],
                },
            ],
        };

    const categoryData = Object.entries(data.categories).map(([key, value]) => ({
        label: key,
        amount: value.categoryTotalSpendings.expenses / 100,
    }));

    const barChartData = {
        labels: categoryData.map((data) => data.label),
        datasets: [
            {
                data: categoryData.map((data) => data.amount),
            },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Expenses to time ratio</Text>
                <ScrollView horizontal>
                    <LineChart
                        data={lineChartData}
                        width={Math.max(
                            Dimensions.get('window').width,
                            lineChartData.labels.length * 60
                        )}
                        height={330}
                        yAxisLabel={currencySymbol}
                        fromZero
                        chartConfig={lineChartConfig}
                        style={styles.chart}
                    // verticalLabelRotation={45}
                    />
                </ScrollView>
            </View>


            <View style={[styles.chartContainer, { height: 450 }]}>
                <Text style={styles.chartTitle}>Breakdown of expenses by category</Text>
                {barChartData.labels.length > 0 ? (
                    <ScrollView horizontal>
                        <BarChart
                            data={{
                                labels: barChartData.labels,
                                datasets: [
                                    {
                                        data: barChartData.datasets[0].data.map((value) =>
                                            Math.abs(value)
                                        ),
                                    },
                                ],
                            }}
                            width={Math.max(
                                barChartData.labels.length * 80,
                                Dimensions.get("window").width
                            )}
                            height={400}
                            yAxisLabel={currencySymbol}
                            yAxisSuffix=""
                            fromZero
                            showValuesOnTopOfBars
                            withInnerLines
                            segments={5}
                            chartConfig={barChartConfig}
                            style={styles.chart}
                            verticalLabelRotation={45}
                        />
                    </ScrollView>
                ) : (
                    <Text style={styles.noDataText}>No data to display</Text>
                )}
            </View>
        </ScrollView>
    );
};

const lineChartConfig = {
    backgroundColor: '#f7f7f7',
    backgroundGradientFrom: '#f7f7f7',
    backgroundGradientTo: '#f1f2f6',
    color: (opacity = 1) => `rgba(255, 71, 87, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(75, 101, 132, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
};

const barChartConfig = {
    backgroundColor: '#f7f7f7',
    backgroundGradientFrom: '#f7f7f7',
    backgroundGradientTo: '#f1f2f6',
    color: (opacity = 1) => `rgba(255, 71, 87, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(75, 101, 132, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.8,
    decimalPlaces: 0,
};


export default DashboardScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 20,
    },
    title: {
        color: '#4b6584',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginVertical: 20,
    },
    chartContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
    },
    chartTitle: {
        color: '#4b6584',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chart: {
        borderRadius: 10,
    },
    noDataText: {
        color: '#4b6584',
        textAlign: 'center',
        marginTop: 20,
    },
});