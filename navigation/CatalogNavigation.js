import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import CatalogScreen from '../screens/Catalog/CatalogScreen';
import ProductScreen from '../screens/Catalog/ProdutcScreen';
import { colors } from '../components/mainStyles';
import NewReviewScreen from '../screens/Catalog/NewReviewScreen';

const Stack = createStackNavigator();

export default function CatalogNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.moreDark, },
                headerTitleStyle: { color: 'white' },
            }}>
            <Stack.Screen name='Catalog' component={CatalogScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Product' component={ProductScreen} options={{ headerBackTitleVisible: false, }} />
            <Stack.Screen name='NewReview' component={NewReviewScreen} options={{ headerBackTitleVisible: false, title: 'Новый отзыв' }} />
        </Stack.Navigator>
    )
}