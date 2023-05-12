import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ApiUrl } from '../../config';
import { Load } from '../../components/Load';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import ProductCard from '../../components/ProductCard';

export default function FavoritesScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [favorites, setFavorites] = React.useState([]);
    const [products, setProducts] = React.useState([]);

    const fetchData = () => {
        setIsLoading(true);
        setFavorites([]);
        setProducts([]);
        AsyncStorage.getItem('favorites', async (errs, favorites) => {
            console.log(favorites)
            if (!favorites || favorites == '[]') {
                setIsLoading(false);
                return;
            };
            favorites = JSON.parse(favorites);
            setFavorites(favorites);
            let formData = new FormData();
            favorites.map(e => { formData.append('products[]', e) });
            await fetch(`${ApiUrl}catalog/productsin`, {
                method: 'post',
                body: formData,
            }).then(response => response.json()).then(response => {
                setProducts(response.data.products);
            }).finally(() => setIsLoading(false));
        });
    }

    React.useEffect(fetchData, []);

    if (isLoading) {
        return <Load />;
    }

    if (!products.length) {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.dark }}>
                <Text style={{ fontSize: 30, color: colors.white, marginBottom: 20, textAlign: 'center' }}>Ваш список избранных товаров пуст</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Catalog")}>
                    <Text style={{ fontSize: 20, color: 'silver', textAlign: 'center' }}>Вы можете добавлять сюда товары из каталога</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: colors.dark }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {products.map((e, i) => {
                        return (
                            <ProductCard key={`product-${i}`} product={e} favorites={favorites} navigation={navigation} />
                        )
                    })}
                </View>
            </View>
        </ScrollView>
    )
}