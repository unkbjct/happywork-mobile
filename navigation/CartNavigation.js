import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import CartScreen from '../screens/Cart/CartScreen';
import { colors } from '../components/mainStyles';
import OrderSceen from '../screens/Cart/OrderScreen';

const Stack = createStackNavigator();


export default function CartNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.moreDark },
                headerTitleStyle: { color: 'white' },
            }}>
            <Stack.Screen name={"Cart"} component={CartScreen} options={{ title: 'Корзина' }} />
            <Stack.Screen name={"Order"} component={OrderSceen} options={{ title: 'Оформление заказа', headerBackTitleVisible: false }} />
        </Stack.Navigator>
    )
}