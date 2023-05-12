import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Load } from '../../components/Load';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../components/mainStyles';
import { Alert, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Input from '../../components/Input';
import RNPickerSelect from 'react-native-picker-select';
import { ApiUrl } from '../../config';

export default function OrderSceen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);

    const [deliveryPrice, setDeliveryPrice] = React.useState(0);
    const [delivery, setDelivery] = React.useState("Курьером в черте города");
    const [deliveryKey, setDeliveryKey] = React.useState(1);
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [house, setHouse] = React.useState('');
    const [apart, setApart] = React.useState('');
    const [comment, setComment] = React.useState('');

    const { products, amount } = route.params;

    const deliveryItems = [
        { key: 1, price: 0, label: "Курьером в черте города", value: "Курьером в черте города" },
        { key: 2, price: 0, label: "Самовывоз ТЦ \"Мармелад\"", value: "Самовывоз ТЦ \"Мармелад\"" },
        { key: 3, price: 500, label: "Курьером по Новгородской области", value: "Курьером по Новгородской области" },
        { key: 4, price: 0, label: "Самовывоз ТД \"Русь\"", value: "Самовывоз ТД \"Русь\"" },
    ]


    const fetchData = () => {
        setIsLoading(true)
        AsyncStorage.getItem('user', async (errs, user) => {
            user = JSON.parse(user)
            setUser(user)
            setName(user.name)
            setPhone(user.phone)
            setEmail(user.email)
            setCity(user.city)

            await fetch(`${ApiUrl}catalog/cart/clear`, {
                method: "post"
            }).then(response => response.json()).then(response => {
                console.log(response)
            })

            await products.map(async (e) => {
                let formData = new FormData();
                formData.append("product", e.id);
                formData.append("count", e.cartCount);
                await fetch(`${ApiUrl}catalog/cart/add`, {
                    method: "post",
                    body: formData,
                }).then(response => response.json()).then(response => {
                    console.log(response)
                }).finally(() => { })
            })
            setIsLoading(false)
        });
    }

    React.useEffect(fetchData, []);

    if (isLoading) {
        return (
            <Load />
        )
    }

    return (
        <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: colors.dark }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
            <View style={{ padding: 20 }}>
                <View style={{ marginBottom: 30, borderBottomColor: 'silver', borderBottomWidth: 1 }}>
                    <Text style={styles.title}>Контактные данные</Text>
                    <Input label={'Ваше имя *'} value={name} onChange={value => setName(value)} />
                    <Input label={'Телефон *'} value={phone} onChange={value => setPhone(value)} />
                    <Input label={'Электронная почта'} value={email} onChange={value => setEmail(value)} />
                </View>
                <View style={{ marginBottom: 30, borderBottomColor: 'silver', borderBottomWidth: 1 }}>
                    <Text style={styles.title}>Адрес доставки заказа</Text>
                    <View style={{ marginBottom: 20, }}>
                        <Text style={{ fontSize: 20, color: 'white', marginBottom: 10, }}>Способ доставки</Text>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            placeholder={{}}
                            onValueChange={(value, i) => {
                                setDeliveryPrice(deliveryItems[i].price)
                                setDelivery(deliveryItems[i].value)
                                setDeliveryKey(deliveryItems[i].key)
                            }}
                            items={deliveryItems}
                        />
                    </View>
                    {(deliveryKey == 1 || deliveryKey == 3) ?
                        <View>
                            <Input label={'Город'} value={city} onChange={value => setCity(value)} />
                            <Input label={'Улица'} value={street} onChange={value => setStreet(value)} />
                            <Input label={'Дом/Корпус'} value={house} onChange={value => setHouse(value)} />
                            <Input label={'Квартира'} value={apart} onChange={value => setApart(value)} />
                            <Input label={'Комментарий'} value={comment} onChange={value => setComment(value)} multi={true} />
                        </View>
                        :
                        <></>
                    }
                </View>
                <View style={{ marginBottom: 30, borderBottomWidth: 1, borderBottomColor: 'silver' }}>
                    {products.map((e, i) => {
                        return (
                            <View key={`product-${i}`} style={styles.productItem}>
                                <Text style={{ fontSize: 16, color: 'rgb(220, 220, 220)', flex: 3 }}>{e.title} {e.cartCount} шт.</Text>
                                <Text style={{ fontSize: 16, color: 'rgb(220, 220, 220)', fontWeight: 600, flex: 1, textAlign: 'right' }}>{priceFormat(e.cartCount * (e.sale ? e.sale : e.price))}</Text>
                            </View>
                        )
                    })}
                    <View style={styles.productItem}>
                        <Text style={{ fontSize: 16, color: 'rgb(220, 220, 220)', flex: 3 }}>Доставка</Text>
                        <Text style={{ fontSize: 16, color: 'rgb(220, 220, 220)', fontWeight: 600, flex: 1, textAlign: 'right' }}>{priceFormat(deliveryPrice)}</Text>
                    </View>
                    <View style={[styles.productItem, { marginTop: 20 }]}>
                        <Text style={{ fontSize: 18, color: 'white', flex: 1 }}>Всего</Text>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: 600, flex: 1, textAlign: 'right' }}>{priceFormat(amount + deliveryPrice)}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.warning }} onPress={async () => {
                        let formData = new FormData();
                        formData.append("name", name);
                        formData.append("phone", phone);
                        formData.append("email", email);
                        formData.append("city", city);
                        formData.append("street", street);
                        formData.append("house", house);
                        formData.append("apart", apart);
                        formData.append("comment", comment);
                        formData.append("delivery", delivery);
                        formData.append("amount", amount);
                        formData.append("delivery_price", deliveryPrice);
                        formData.append("user", user.id);

                        await fetch(`${ApiUrl}catalog/order/create`, {
                            method: "post",
                            body: formData,
                        }).then(response => response.json()).then(response => {
                            if (!response.ok) {
                                let string = '';
                                console.log(response.data.errors)
                                for (let err in response.data.errors) {
                                    string += response.data.errors[err] + '\n'
                                }
                                Alert.alert(string)
                                return;
                            }
                            console.log(response);
                            // return
                            Alert.alert("Заказ успешно создан", "", [
                                {
                                    text: "Ок",
                                    onPress: () => {
                                        AsyncStorage.removeItem("cart");
                                        navigation.navigate("OrderInfo", { orderId: response.data.order.id })
                                    }
                                }
                            ]);
                        })

                    }}>
                        <Text>Оформить заказ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

function priceFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ₽.'
}

const styles = StyleSheet.create({
    productItem: {
        marginBottom: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    title: {
        color: colors.white,
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 20,
    },
    select: {
        borderWidth: 1,
        borderColor: 'silver'
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 2,
        color: 'black',
        backgroundColor: 'silver',
        textAlign: 'center',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 2,
        color: 'black',
        textAlign: 'center',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});