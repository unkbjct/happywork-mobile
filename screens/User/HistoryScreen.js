import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ApiUrl } from '../../config';
import { Load } from '../../components/Load';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/mainStyles';

export default function HistoryScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [orders, setOrders] = React.useState([]);

    const fetchData = () => {
        setIsLoading(true);
        AsyncStorage.getItem("user", async (errs, user) => {
            user = JSON.parse(user);
            setUser(user);
            let formData = new FormData();
            formData.append("apiToken", user.api_token);
            await fetch(`${ApiUrl}user/history`, {
                method: 'post',
                body: formData
            }).then(response => response.json()).then(response => {
                setOrders(response.data.orders);
            }).finally(() => setIsLoading(false));
        })
    }

    React.useEffect(fetchData, []);

    if (isLoading) return <Load />

    if (!orders.length) return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.dark }}>
            <Text style={{ fontSize: 30, color: colors.white, marginBottom: 20, textAlign: 'center' }}>У вас еще нет ни одного заказа</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Catalog")}>
                <Text style={{ fontSize: 20, color: 'silver', textAlign: 'center' }}>Вы можете заказать товар из каталога</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <ScrollView style={{ backgroundColor: colors.dark }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
            <View style={{ flex: 1, paddingVertical: 20, }}>
                {orders.map((e, i) => {
                    return (
                        <View key={`oreder-${i}`} style={styles.orderItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, }}>
                                <Text style={{ fontSize: 20 }}>Заказ # {e.id}</Text>
                                <Text style={{ fontSize: 20 }}>{createStatus(e.status)}</Text>
                            </View>
                            <Text style={{ fontSize: 18, marginBottom: 10 }}>Сумма заказа: <Text style={{ fontWeight: 600 }}>{priceFormat(e.amount + e.delivery_price)}</Text></Text>
                            <Text style={{ fontSize: 18, marginBottom: 20 }}>Доставка: <Text style={{ fontWeight: 600 }}>{e.delivery}</Text></Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text>{(new Date(e.created_at).toLocaleDateString("ru-RU"))}</Text>
                                <TouchableOpacity style={{ backgroundColor: colors.moreDark, paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => navigation.navigate("OrderInfo", { orderId: e.id })}>
                                    <Text style={{ color: colors.white }}>Детали</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}

function priceFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ₽.'
}

function createStatus(status) {
    switch (status) {
        case 'created':
            return (
                <View style={styles.badge}>
                    <Text style={{ fontSize: 16 }}>Новый</Text>
                </View>
            )
        case 'in_road':
            return (
                <View style={styles.badge}>
                    <Text style={{ fontSize: 16 }}>В пути</Text>
                </View>
            )
        case 'expecting':
            return (
                <View style={styles.badge}>
                    <Text style={{ fontSize: 16 }}>Ожидает получателя</Text>
                </View>
            )
        case 'canceled':
            return (
                <View style={styles.badge}>
                    <Text style={{ fontSize: 16 }}>Отменен</Text>
                </View>
            )
        default:
            return (
                <View style={styles.badge}>
                    <Text style={{ fontSize: 16 }}>Получен</Text>
                </View>
            )
    }
}

const styles = StyleSheet.create({
    orderItem: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: 'rgb(220, 220, 220)',
    },
    badge: {
        borderWidth: 1,
        borderColor: 'silver',
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: 'rgb(200, 200, 200)',
        // backgroundColor: colors.warning,
        borderRadius: 4,
    }
})