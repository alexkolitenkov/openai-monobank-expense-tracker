import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useState, useEffect } from 'react'
import HomeScreen from '../screens/Home/HomeScreen'
import ChatbotScreen from '../screens/Home/ChatbotScreen'
import DashboardScreen from '../screens/Home/DashboardScreen'
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../constants/routes'
import { EditUserInfoModal } from '../components/DrawerNavigation/EditUserInfoModal'
import { useMonobank } from '../contexts/MonobankContext'
const Drawer = createDrawerNavigator()

function CustomDrawerContent(props) {
    const { user, logout, dispatch } = useAuth()
    const { cardNumber } = useMonobank()
    const [modalVisible, setModalVisible] = useState(false)

    const handleLogout = (props) => {
        Alert.alert('Sign Out', 'Are you sure you want to Sign out?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    // setIsLoading(true)
                    dispatch({ type: 'SET_LOADING', payload: true })

                    await logout()
                    props.navigation.replace(ROUTES.SIGNIN)
                    // setIsLoading(false)
                    dispatch({ type: 'SET_LOADING', payload: false })

                }
            },
        ])
        return true
    }

    return (
        <>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
                {/* Top Section: User Info */}
                <View style={styles.userInfoCard}>
                    <View style={styles.userInfoBlock}>
                        <View style={styles.userInfoBlockTitle}>
                            <AntDesign name='user' size={16} color='#4b6584' />
                            <Text style={styles.drawerTextColor}>Name</Text>
                        </View>
                        <Text style={styles.drawerTextColor}>{user?.name || 'Guest'}</Text>
                    </View>
                    <View style={styles.userInfoBlock}>
                        <View style={styles.userInfoBlockTitle}>
                            <Fontisto name='email' size={16} color='#4b6584' />
                            <Text style={styles.drawerTextColor}>Email</Text>
                        </View>
                        <Text style={styles.drawerTextColor}>{user?.email}</Text>
                    </View>
                    <View style={styles.userInfoBlock}>
                        <View style={styles.userInfoBlockTitle}>
                            <MaterialCommunityIcons name='bank-outline' size={16} color='#4b6584' />
                            <Text style={styles.drawerTextColor}>Default Account</Text>
                        </View>
                        <Text style={styles.drawerTextColor}>{user?.defaultAccount ? cardNumber : 'No account chosen'}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.editButton}
                    onPress={() => setModalVisible(true)}>
                    <Ionicons name='settings-outline' size={24} color='#4b6584' />
                </TouchableOpacity>

                {/* Middle Section: Navigation Items */}
                <View style={styles.navigationItems}>
                    <DrawerItem
                        label='Home'
                        onPress={() => props.navigation.navigate(ROUTES.HOME)}
                        focused={props.state.index === props.state.routes.findIndex(e => e.name === ROUTES.HOME)}
                        activeBackgroundColor='#e8f0fe'
                        activeTintColor='black'
                    />
                    {user?.defaultAccount && <DrawerItem
                        label='AI Advisor'
                        onPress={() => props.navigation.navigate(ROUTES.CHATBOT)}
                        focused={props.state.index === props.state.routes.findIndex(e => e.name === ROUTES.CHATBOT)}
                        activeBackgroundColor='#e8f0fe'
                        activeTintColor='black'
                    />}
                    {user?.defaultAccount && <DrawerItem
                        label='Dashboard'
                        onPress={() => props.navigation.navigate(ROUTES.DASHBOARD)}
                        focused={props.state.index === props.state.routes.findIndex(e => e.name === ROUTES.DASHBOARD)}
                        activeBackgroundColor='#e8f0fe'
                        activeTintColor='black'
                    />}
                </View>

                {/* Bottom Section: Logout */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => {
                        handleLogout(props)
                    }}>
                        <Ionicons name='log-out-outline' size={24} color='#4b6584' />
                        <Text style={styles.logoutText} >Sign out</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView >
            <EditUserInfoModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
    )
}

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={() => ({
                header: ({ navigation, options }) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Ionicons name='menu' size={28} color='#4b6584' style={options.headerStyle} />
                        </TouchableOpacity>
                    )
                },
                headerStyle: {
                    position: 'absolute',
                    top: 20,
                    right: 20,
                },
            })}
        >
            <Drawer.Screen name='Home' component={HomeScreen} />
            <Drawer.Screen name='Chatbot' component={ChatbotScreen} />
            <Drawer.Screen name='Dashboard' component={DashboardScreen} />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    userInfoCard: {
        backgroundColor: '#e8f0fe',
        borderRadius: 10,
        padding: 15,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    userInfoBlock: {
        marginVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userInfoBlockTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 5,
    },
    drawerTextColor: {
        color: '#4b6584'
    },
    editButton: {
        position: 'absolute',
        top: 30,
        right: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f0fe',
        borderRadius: 10,
    },
    navigationItems: {
        flex: 1
    },
    logoutSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row'
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignItems: 'center',
        color: '#4b6584'
    }
})