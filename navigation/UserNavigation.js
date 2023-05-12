import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import UserScreen from '../screens/User/UserScreen';
import { colors } from '../components/mainStyles';
import FavoritesScreen from '../screens/User/FavoritesScreen';
import HistoryScreen from '../screens/User/HistoryScreen';
import OrderInfoScreen from '../screens/User/OrderInfoScreen';
import RepairScreen from '../screens/User/RepairScreen';
import EditScreen from '../screens/User/EditScreen';
import DeliveryScreen from '../screens/User/DeliveryScreen';
import ContactsScreen from '../screens/User/ContactsScreen';

const Stack = createStackNavigator();

export default function UserNavigation() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.moreDark },
                headerTitleStyle: { color: 'white' },
            }}>
            <Stack.Screen name='User' component={UserScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Favorites' component={FavoritesScreen} options={{ title: "Избранное", headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name='History' component={HistoryScreen} options={{ title: "История заказов", headerShown: true, headerBackTitleVisible: false, }} />
            <Stack.Screen name='OrderInfo' component={OrderInfoScreen} options={{ title: "Заказ", headerShown: true, headerBackTitleVisible: false, freezeOnBlur: false }} />
            <Stack.Screen name='Repair' component={RepairScreen} options={{ title: "Заявка на ремонт", headerShown: true, headerBackTitleVisible: false }} />
            <Stack.Screen name='Edit' component={EditScreen} options={{ title: "Редактирование данных", headerShown: true, headerBackTitleVisible: false }} />
            <Stack.Screen name='Delivery' component={DeliveryScreen} options={{ title: "Информация о доставке", headerShown: true, headerBackTitleVisible: false }} />
            <Stack.Screen name='Contacts' component={ContactsScreen} options={{ title: "Контакты", headerShown: true, headerBackTitleVisible: false }} />
        </Stack.Navigator>
    )

}