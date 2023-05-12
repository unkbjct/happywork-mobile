import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import AuthScreen from '../screens/Auth/AuthScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import { Load } from '../components/Load';
import CatalogScreen from '../screens/Catalog/CatalogScreen';
import { colors } from '../components/mainStyles';
import CatalogNavigation from './CatalogNavigation';
import CartNavigation from './CartNavigation';
import UserNavigation from './UserNavigation';

const ScreenNames = {
    Catalog: 'Каталог',
    Cart: 'Корзина',
    User: 'Профиль',
}

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function MainNavigation() {

    const [isLoading, setIsLoading] = React.useState(true);
    const [isAuth, setIsAuth] = React.useState(true);
    const [cart, setCart] = React.useState([]);



    const checkAuth = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', async (errs, user) => {
            (user) ? setIsAuth(true) : setIsAuth(false);
            await AsyncStorage.getItem("cart", (errs, cart) => {
                if (!cart) return;
                setCart(JSON.parse(cart));
            })
        }).finally(() => setIsLoading(false));
    }

    React.useEffect(checkAuth, []);

    if (isLoading) {
        return (
            <Load />
        )
    }

    return (
        <NavigationContainer>
            <Tabs.Navigator initialRouteName={isAuth ? 'main' : 'auth'}>
                <Tabs.Screen name='auth' component={Auth} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
                <Tabs.Screen name='main' component={Main} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
            </Tabs.Navigator>
        </NavigationContainer>
    )

    function Auth() {
        return (
            <Stack.Navigator>
                <Stack.Screen name='Auth' component={AuthScreen} options={{ title: 'Авторизация', headerShown: false, unmountOnBlur: true }} />
                <Stack.Screen name='Signup' component={SignupScreen} options={{ title: 'Регистрация', headerShown: false }} />
            </Stack.Navigator>
        )
    }

    function Main() {
        return (
            <Tabs.Navigator
                // header={'asd'}
                screenOptions={({ route }) => ({
                    tabBarStyle: {
                        backgroundColor: colors.moreDark,
                        borderTopWidth: 0,
                    },
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => {
                        let iconName;

                        let rn = route.name;
                        // console.debug();
                        switch (rn) {
                            case ScreenNames.Catalog:
                                iconName = focused ? 'albums' : 'albums-outline';
                                break;
                            case ScreenNames.Cart:
                                iconName = focused ? 'cart' : 'cart-outline';
                                break;
                            case ScreenNames.User:
                                iconName = focused ? 'person' : 'person-outline';
                                break;

                        }

                        color = focused ? colors.warning : 'white';
                        // size = 20;
                        return <Ionicons name={iconName} size={25} color={color} />
                    },
                    tabBarLabelStyle: {
                        color: 'white'
                    },
                })}
            >

                <Tabs.Screen name={ScreenNames.Catalog} component={CatalogNavigation} asd={'asd'} options={{ title: 'Каталог', headerShown: false, }} />
                <Tabs.Screen name={ScreenNames.Cart} component={CartNavigation} options={{ headerShown: false, unmountOnBlur: true }} />
                <Tabs.Screen name={ScreenNames.User} component={UserNavigation} options={{ headerShown: false }} />

            </Tabs.Navigator>
        );
    }
}

