import * as React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ApiUrl } from '../../config';
import { colors } from '../../components/mainStyles';
import { Load } from '../../components/Load';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CatalogScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [q, setQ] = React.useState('');
    const [tmpQ, setTmpQ] = React.useState('');
    const [products, setProducts] = React.useState([]);
    const [category, setCategory] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const [treeCategory, setTreeCategory] = React.useState();
    const [parentCategories, setParentCategories] = React.useState([]);
    const [titleEng, setTitleEng] = React.useState('');
    const [favorites, setFavorites] = React.useState([]);
    var text = '';

    const fetchData = () => {
        let formData = new FormData();
        formData.append('q', text);
        setIsLoading(true);
        fetch(`${ApiUrl}catalog${text ? '' : "/" + titleEng}`, {
            method: 'post',
            body: formData,
        }).then(response => response.json()).then(async response => {
            // console.log(response.data.products)
            if (!text) {
                if (titleEng === '') {
                    setCategories(response.data.categories);
                    setCategory(null)
                } else {
                    setCategories(response.data.category.nextLevel);
                    setCategory(response.data.category)
                }
            } else {

            }
            await setProducts(response.data.products);
            await setTreeCategory(response.data.treeCategories);
            await setParentCategories(Object.values(response.data.parentCategories).reverse());
            await AsyncStorage.getItem("favorites", (errs, favorites) => {
                if (!favorites) return;
                favorites = JSON.parse(favorites);
                setFavorites(favorites);
            })
            // setIsLoading(false)
        }).finally(() => setIsLoading(false))
    }

    React.useEffect(fetchData, [titleEng]);

    if (isLoading) {
        return (
            <Load />
        )
    }

    if (q) {
        return (
            <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
                <View style={{ paddingBottom: 100, }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
                        <TextInput defaultValue={q} style={styles.searchInput} placeholder='Поиск...' onChangeText={value => setTmpQ(value)} />
                        <TouchableOpacity style={styles.searchBtn} onPress={async () => {
                            setQ(tmpQ)
                            text = tmpQ;
                            fetchData();
                        }}>
                            <Ionicons size={20} name={'search'} color={colors.warning} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderTopColor: 'silver', borderTopWidth: 1, paddingTop: 20, }}>
                        <Text style={[styles.title, { textAlign: 'left' }]}>Товары по запросу "{q}"</Text>
                        {products.length ?
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {products.map((e, i) => {
                                    return (
                                        <ProductCard key={`product-${i}`} product={e} favorites={favorites} navigation={navigation} />
                                    )
                                })}
                            </View>
                            :
                            <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, marginTop: 20, padding: 20, }}>
                                <Text style={styles.title}>Товары не найдены</Text>
                                <TouchableOpacity onPress={() => {
                                    text = '';
                                    setTitleEng('');
                                    setQ('');
                                }}><Text style={styles.categoryLink}>Каталог</Text></TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
            <View style={{ paddingBottom: 100, }}>
                <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
                    <TextInput style={styles.searchInput} placeholder='Поиск...' onChangeText={value => setTmpQ(value)} />
                    <TouchableOpacity style={styles.searchBtn} onPress={async () => {
                        await setQ(tmpQ);
                        fetchData();
                    }}>
                        <Ionicons size={20} name={'search'} color={colors.warning} />
                    </TouchableOpacity>
                </View>
                {titleEng !== '' ?
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 30, }}>
                        <TouchableOpacity onPress={() => setTitleEng('')}>
                            <Text style={styles.categoryLink}>Каталог -</Text>
                        </TouchableOpacity>
                        {parentCategories.map((e, i) => {
                            return (
                                <TouchableOpacity key={`parent-${i}`} onPress={() => setTitleEng(e.title_eng)}>
                                    <Text style={styles.categoryLink}>{e.title} {parentCategories.length != i + 1 ? '-' : <></>}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    :
                    <></>
                }
                {categories.length ?
                    <View style={{ marginBottom: 40, }}>
                        <Text style={styles.title}>{category ? category.title : 'Каталог'}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {categories.map((e, i) => {
                                return (
                                    <CategoryCard key={`category-${i}`} category={e} onPress={titleEng => setTitleEng(titleEng)} />
                                )
                            })}
                        </View>
                    </View>
                    :
                    <></>
                }
                {titleEng === '' ?
                    <></>
                    :
                    <View style={{ borderTopColor: 'silver', borderTopWidth: 1, paddingTop: 20, }}>
                        <Text style={[styles.title, { textAlign: 'right' }]}>Товары</Text>
                        {products.length ?
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {products.map((e, i) => {
                                    return (
                                        <ProductCard key={`product-${i}`} product={e} favorites={favorites} navigation={navigation} />
                                    )
                                })}
                            </View>
                            :
                            <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, marginTop: 20, padding: 20, }}>
                                <Text style={styles.title}>Товары не найдены</Text>
                                <TouchableOpacity onPress={() => setTitleEng('')}><Text style={styles.categoryLink}>Каталог</Text></TouchableOpacity>
                            </View>
                        }
                    </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
        padding: 20,
    },
    searchInput: {
        backgroundColor: 'white',
        fontSize: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
        flex: 9,
    },
    searchBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderLeftWidth: 1,
        borderColor: 'silver',
        backgroundColor: 'white',
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    title: {
        fontSize: 25,
        color: 'white',
        fontWeight: 600,
        marginBottom: 20
    },
    categoryLink: {
        fontSize: 15,
        color: 'silver',
        marginRight: 5,
        marginBottom: 5,
    }
})