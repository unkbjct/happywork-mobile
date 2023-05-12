import * as React from 'react';
import { ApiUrl } from '../../config';
import { Load } from '../../components/Load';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../components/mainStyles';

export default function OrderInfoScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [products, setProducts] = React.useState([]);
    const [order, setOrder] = React.useState();
    const { orderId } = route.params;

    const fetchData = () => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('order', orderId);
        fetch(`${ApiUrl}order/info`, {
            method: 'post',
            body: formData,
        }).then(response => response.json()).then(response => {
            navigation.setOptions({
                title: `Заказ # ${orderId}`
            })
            setOrder(response.data.order);
            setProducts(response.data.orderProducts);
        }).finally(() => setIsLoading(false))
    }

    React.useEffect(fetchData, [orderId]);

    if (isLoading) return <Load />

    return (
        <ScrollView style={{ backgroundColor: colors.dark }}>
            <View style={{ padding: 0 }}>
                <View style={{ marginBottom: 30 }}>
                    <View style={styles.infoItem}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Создан:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{(new Date(order.created_at).toLocaleDateString("ru-RU"))}</Text>
                        </View>
                    </View>
                    <View style={[styles.infoItem, styles.secondBorder]}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Сумма заказа:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{priceFormat(order.amount)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Способ доставки:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{order.delivery}</Text>
                        </View>
                    </View>
                    <View style={[styles.infoItem, styles.secondBorder]}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Стоимость доставки:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{priceFormat(order.delivery_price)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Имя получателя:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{order.name}</Text>
                        </View>
                    </View>
                    <View style={[styles.infoItem, styles.secondBorder]}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Телефон:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{order.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.leftItem}>
                            <Text style={[styles.text, { textAlign: 'right' }]}>Почта:</Text>
                        </View>
                        <View style={styles.rightItem}>
                            <Text style={styles.text}>{order.email ? order.email : 'Нет'}</Text>
                        </View>
                    </View>
                    {(order.delivery == 'Курьером в черте города' || order.delivery == 'Курьером по Новгородской области') ?
                        <View>
                            <View style={[styles.infoItem, styles.secondBorder]}>
                                <View style={styles.leftItem}>
                                    <Text style={[styles.text, { textAlign: 'right' }]}>Город доставки:</Text>
                                </View>
                                <View style={styles.rightItem}>
                                    <Text style={styles.text}>{order.city ? order.city : 'Не указан'}</Text>
                                </View>
                            </View>
                            <View style={styles.infoItem}>
                                <View style={styles.leftItem}>
                                    <Text style={[styles.text, { textAlign: 'right' }]}>Адрес доставки:</Text>
                                </View>
                                <View style={styles.rightItem}>
                                    <Text style={styles.text}>{order.street}, {order.house}, кв. {order.apart}</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <></>
                    }
                    <View>
                        <View style={[styles.infoItem, styles.secondBorder]}>
                            <View style={styles.leftItem}>
                                <Text style={[styles.text, { textAlign: 'right' }]}>Комментарий:</Text>
                            </View>
                            <View style={styles.rightItem}>
                                <Text style={styles.text}>{order.comment ? order.comment : 'Нет'}</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.leftItem}>
                                <Text style={[styles.text, { textAlign: 'right' }]}>Статус заказа:</Text>
                            </View>
                            <View style={styles.rightItem}>
                                <Text style={styles.text}>{createStatus(order.status)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 20, }}>
                    <Text style={{ fontSize: 22, color: 'white', textAlign: 'center', fontWeight: 600, marginBottom: 30, }}>Позиции товара</Text>
                    {products.map((e, i) => {
                        return (
                            <View key={`product-${i}`} style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'silver', paddingBottom: 4, }}>
                                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                                    <Text style={[styles.textProd, { flex: 3, paddingRight: 10, }]}>{e.title} {e.count} шт.</Text>
                                    <Text style={[styles.textProd, { flex: 2, textAlign: 'right' }]}>{priceFormat2(e.count * e.price)}</Text>
                                </View>
                                <Text style={{ color: 'gray', fontSize: 15 }}>{priceFormat(e.price)} за шт.</Text>
                            </View>
                        )
                    })}
                    <View style={{ marginBottom: 35, borderBottomWidth: 1, borderBottomColor: 'silver', paddingBottom: 4, }}>
                        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                            <Text style={[styles.textProd, { flex: 3, paddingRight: 10, }]}>Доставка</Text>
                            <Text style={[styles.textProd, { flex: 2, textAlign: 'right' }]}>{priceFormat2(order.delivery_price)}</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'silver', paddingBottom: 4, }}>
                        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                            <Text style={[{ fontSize: 22, color: 'white', flex: 3, paddingRight: 10, }]}>Итого</Text>
                            <Text style={[{ fontSize: 22, color: 'white', flex: 2, textAlign: 'right' }]}>{priceFormat2(order.delivery_price + order.amount)}</Text>
                        </View>
                    </View>
                </View>
            </View >
        </ScrollView >
    )
}

function priceFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' Рублей.'
}
function priceFormat2(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ₽.'
}

function createStatus(status) {
    switch (status) {
        case 'created':
            return <Text>Новый</Text>
        case 'in_road':
            return <Text>В пути</Text>
        case 'expecting':
            return <Text>Ожидает получателя</Text>
        case 'canceled':
            return <Text>Отменен</Text>
        default:
            return <Text>Получен</Text>

    }
}

const styles = StyleSheet.create({
    infoItem: {
        flexDirection: 'row',
        backgroundColor: 'rgb(230, 230, 230)',
        borderBottomColor: 'rgb(160, 160, 160)',
        borderBottomWidth: 1,
        // alignItems: 'flex-end'
    },
    leftItem: {
        borderRightWidth: 1,
        borderColor: 'rgb(160, 160, 160)',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    rightItem: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    text: {
        fontSize: 18,
    },
    secondBorder: {
        backgroundColor: 'rgba(230, 230, 230, .95)',
    },
    textProd: {
        fontSize: 18,
        color: 'silver',
    }
})