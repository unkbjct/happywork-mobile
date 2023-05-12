import * as React from 'react';
import { ApiUrl, SiteUrl } from '../../config';
import { Load } from '../../components/Load';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CartScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [cart, setCart] = React.useState([]);
    const [user, setUser] = React.useState();
    const [products, setProducts] = React.useState([]);
    const [amount, setAmount] = React.useState(0);

    const updateBadge = () => {
        navigation.setOptions({
            tabBarBadge: cart.length
        })
    }

    const fetchData = () => {
        setIsLoading(true)

        AsyncStorage.getItem("cart", async (errs, cart) => {
            if (!cart || cart == '[]') {
                setIsLoading(false);
                return
            };
            cart = JSON.parse(cart)
            setCart(cart);

            let formData = new FormData();
            cart.map(e => { formData.append('products[]', e.id) });

            await fetch(`${ApiUrl}catalog/productsin`, {
                method: 'post',
                body: formData,
            }).then(async response => await response.json()).then(async response => {
                let tmpProducts = response.data.products;
                let tmpAmount = 0;
                tmpProducts.map(e => {
                    e.cartCount = cart[cart.findIndex(({ id }) => id === e.id)].count
                    tmpAmount += e.cartCount * (e.sale ? e.sale : e.price);
                })
                await setProducts(response.data.products);
                await setAmount(tmpAmount);
            }).finally(() => setIsLoading(false))
        })


    }

    React.useEffect(fetchData, []);

    if (isLoading) {
        return (
            <Load />
        )
    }

    if (!cart.length) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.dark, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, color: colors.white, marginBottom: 20, }}>Коризна пуста</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Catalog")}>
                    <Text style={{ fontSize: 20, color: 'silver' }}>Самое время перейти в каталог</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: colors.dark }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
            <View style={{ padding: 20, }}>
                <View style={{ marginBottom: 30 }}>
                    {products.map((e, i) => {
                        return (
                            <View key={`cart-${i}`} style={styles.cartItem}>
                                <Image style={styles.image} source={{ uri: `${SiteUrl}${e.image}` }} />
                                <View style={styles.info}>
                                    <Text style={styles.title}>{e.title}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: 500, fontSize: 16 }}>{e.sale ? priceFormat(e.sale * e.cartCount) : priceFormat(e.price * e.cartCount)}</Text>
                                        <Text style={styles.text}> {e.sale ? priceFormat(e.sale) : priceFormat(e.price)} за шт.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.warning }}>
                                            <TouchableOpacity style={styles.btnCount} onPress={async () => {
                                                let tmpCart = cart;
                                                (tmpCart[tmpCart.findIndex(({ id }) => id === e.id)].count == 1)
                                                    ? tmpCart.splice(tmpCart.findIndex(({ id }) => id === e.id), 1)
                                                    : tmpCart[tmpCart.findIndex(({ id }) => id === e.id)].count -= 1;

                                                setCart(tmpCart);
                                                await AsyncStorage.setItem("cart", JSON.stringify(tmpCart))
                                                fetchData();
                                            }}>
                                                <Text>-</Text>
                                            </TouchableOpacity>
                                            <View style={{ paddingHorizontal: 10, }}>
                                                <Text>{e.cartCount}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.btnCount} onPress={async () => {
                                                let tmpCart = cart;
                                                (tmpCart.findIndex(({ id }) => id === e.id) !== -1)
                                                    ? tmpCart[tmpCart.findIndex(({ id }) => id === e.id)].count += 1
                                                    : tmpCart.push({
                                                        id: e.id,
                                                        count: 1,
                                                    });
                                                setCart(tmpCart);
                                                await AsyncStorage.setItem("cart", JSON.stringify(tmpCart))
                                                fetchData();
                                            }}>
                                                <Text>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={async () => {
                                                let tmpCart = cart;
                                                tmpCart.splice(tmpCart.findIndex(({ id }) => id === e.id), 1)
                                                setCart(tmpCart);
                                                updateBadge();
                                                await AsyncStorage.setItem("cart", JSON.stringify(tmpCart))
                                                fetchData();
                                            }}>
                                                <Ionicons name='close-circle' size={25} color={colors.warning} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View>
                    <Text style={{ fontSize: 20, color: colors.white, marginBottom: 20, }}>Всего: <Text style={{ fontWeight: 600 }}>{priceFormat(amount)}</Text></Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.moreDark }} onPress={() => {
                            navigation.navigate("Order", { products: products, amount: amount })
                        }}>
                            <Text style={{ fontSize: 18, color: colors.white }}>Оформить заказ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView >
    )
}

function priceFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ₽.'
}


const styles = StyleSheet.create({
    cartItem: {
        // borderWidth: 1,
        marginBottom: 16,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 3,
        flex: 1,
        flexDirection: 'row',
    },
    image: {
        height: 100,
        flex: 1,
        // padding: 10,
        resizeMode: 'contain',
    },
    info: {
        // borderWidth: 1,
        flex: 3,
        paddingHorizontal: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 600,
        // marginBottom: 10,
    },
    text: {
        fontSize: 14,
    },
    btnCount: {
        backgroundColor: colors.warning,
        paddingHorizontal: 8,
        paddingVertical: 4,
    }
})