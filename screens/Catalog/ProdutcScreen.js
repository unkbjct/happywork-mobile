import * as React from 'react';
import { ApiUrl, SiteUrl } from '../../config';
import { Load } from '../../components/Load';
import { Alert, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../../components/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [product, setProduct] = React.useState();
    const [attributes, setAttributes] = React.useState([]);
    const [reviews, setReviews] = React.useState([]);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [favorites, setFavorites] = React.useState([]);
    const [cart, setCart] = React.useState([]);
    const { productId, refresh } = route.params;

    const fetchData = () => {
        setIsLoading(true)
        fetch(`${ApiUrl}catalog/product/${productId}`, {
            method: 'post',
        }).then(response => response.json()).then(async response => {
            await setProduct(response.data.product);
            await setAttributes(response.data.attributes);
            await setReviews(response.data.reviews);
            navigation.setOptions({
                title: response.data.product.title
            })
            await AsyncStorage.getItem('favorites', (errs, favorites) => {
                if (!favorites) return;
                favorites = JSON.parse(favorites);
                setIsFavorite(favorites.includes(response.data.product.id))
                setFavorites(favorites);
            })
            await AsyncStorage.getItem("cart", (errs, cart) => {
                if (!cart) return;
                setCart(JSON.parse(cart));
            })

        }).finally(() => { setIsLoading(false) });
    }

    React.useEffect(fetchData, [navigation, refresh]);

    if (isLoading) {
        return (
            <Load />
        )
    }

    return (
        <KeyboardAwareScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.inner}>
                <View style={styles.section}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Image style={styles.image} source={{ uri: `${SiteUrl}${product.image}` }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 15 }}>
                        <Text style={styles.text}>Наличие товара: {product.count ? <Text style={{ color: colors.warning }}>В наличие</Text> : <Text style={{ color: colors.danger }}>Отсутствует</Text>}</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                            <Ionicons size={20} name={'star'} color={product.rating >= 1 ? colors.warning : 'silver'} />
                            <Ionicons size={20} name={'star'} color={product.rating >= 2 ? colors.warning : 'silver'} />
                            <Ionicons size={20} name={'star'} color={product.rating >= 3 ? colors.warning : 'silver'} />
                            <Ionicons size={20} name={'star'} color={product.rating >= 4 ? colors.warning : 'silver'} />
                            <Ionicons size={20} name={'star'} color={product.rating >= 5 ? colors.warning : 'silver'} />
                            <Text style={[styles.text, { marginLeft: 5, }]}>({product.rating_count})</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.warning, flex: 9, marginEnd: 10, }} onPress={() => {
                            AsyncStorage.getItem("cart", (errs, cart) => {
                                if (!cart) {
                                    AsyncStorage.setItem("cart", JSON.stringify([{
                                        id: productId,
                                        count: 1,
                                    }]))
                                    Alert.alert(`Товар  ${product.title} добавлен в коризну`)
                                    return;
                                }
                                cart = JSON.parse(cart);
                                (cart.findIndex(({ id }) => id === productId) !== -1)
                                    ? cart[cart.findIndex(({ id }) => id === productId)].count += 1
                                    : cart.push({
                                        id: productId,
                                        count: 1,
                                    });
                                setCart(cart);
                                AsyncStorage.setItem("cart", JSON.stringify(cart))
                                Alert.alert(`Товар  ${product.title} добавлен в коризну`)
                            })
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 18 }}>В корзину</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (isFavorite) {
                                favorites.splice(favorites.findIndex(e => e == product.id), 1);
                                AsyncStorage.setItem('favorites', JSON.stringify(favorites));
                            } else {
                                favorites.push(product.id)
                                AsyncStorage.setItem('favorites', JSON.stringify(favorites))
                            }
                            setIsFavorite(!isFavorite)
                        }}
                            style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colors.moreDark, flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Ionicons size={20} name={isFavorite ? 'heart' : 'heart-outline'} color={colors.warning} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Описание</Text>
                    <Text style={styles.text}>{product.description ? product.description : "Описание отсутствует"}</Text>
                </View>
                {attributes.length ?
                    <View style={styles.section}>
                        <Text style={styles.title}>Характеристики</Text>
                        <View>
                            {attributes.map((e, i) => {
                                return (
                                    <View key={`attr-${i}`} style={styles.attrItem}>
                                        <Text style={[styles.text, { width: '50%' }]}>{e.title}</Text>
                                        <Text style={[styles.text, { width: '50%', fontWeight: 600 }]}>{e.value}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    :
                    <></>
                }
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={{ marginRight: 15, }} name='shield-checkmark' size={50} color={colors.warning} />
                        <Text style={{ fontSize: 22, color: 'white' }}>Оригинальная продукция</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={{ marginRight: 15, }} name='repeat' size={50} color={colors.warning} />
                        <Text style={{ fontSize: 22, color: 'white' }}>Гарантия Возврата</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={{ marginRight: 15, }} name='wallet' size={50} color={colors.warning} />
                        <Text style={{ fontSize: 22, color: 'white' }}>Гарантия лучшей цены</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Отзывы</Text>
                    <View>
                        {reviews.map((e, i) => {
                            return (
                                <View key={`review-${i}`} style={styles.reviewItem}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14, }}>
                                        <View style={{ flexDirection: 'row', marginRight: 10, }}>
                                            <Ionicons size={20} name={'star'} color={e.rating >= 1 ? colors.warning : 'silver'} />
                                            <Ionicons size={20} name={'star'} color={e.rating >= 2 ? colors.warning : 'silver'} />
                                            <Ionicons size={20} name={'star'} color={e.rating >= 3 ? colors.warning : 'silver'} />
                                            <Ionicons size={20} name={'star'} color={e.rating >= 4 ? colors.warning : 'silver'} />
                                            <Ionicons size={20} name={'star'} color={e.rating >= 5 ? colors.warning : 'silver'} />
                                        </View>
                                        <Text style={{ marginRight: 20, fontSize: 18 }}>{e.name}</Text>
                                        <Text style={{ color: 'gray' }}>{(new Date(e.created_at).toLocaleDateString("ru-RU"))}</Text>
                                    </View>
                                    <View style={{ marginBottom: 10, }}>
                                        <Text style={{ fontSize: 18 }}>Отзыв - <Text style={{ fontWeight: 600 }}>{e.type == 'plus' ? 'Положительный' : 'Отрицаетльный'}</Text></Text>
                                    </View>
                                    <Text style={{ fontSize: 16 }}>{e.comment}</Text>

                                </View>
                            )
                        })}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button label={'Оставить новый отзыв'} color={colors.warning} onPress={() => navigation.navigate("NewReview", { productId: product.id, productTitle: product.title })} />
                    </View>
                    <View></View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.dark,
    },
    inner: {
        padding: 20,
        backgroundColor: colors.dark,
    },
    title: {
        fontSize: 25,
        color: 'white',
        fontWeight: 600,
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        backgroundColor: colors.white,
        borderRadius: 5,
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: 'rgb(230, 230, 230)'
    },
    section: {
        marginBottom: 30,
    },
    attrItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderBottomColor: 'silver',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    reviewItem: {
        backgroundColor: colors.white,
        marginBottom: 20,
        borderRadius: 3,
        padding: 10,
    }
})