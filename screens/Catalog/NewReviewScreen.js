import * as React from 'react';
import { Alert, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import Input from '../../components/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Load } from '../../components/Load';
import Button from '../../components/Button';
import Checkbox from 'expo-checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApiUrl } from '../../config';

export default function NewReviewScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);
    const [name, setName] = React.useState(null);
    const [comment, setComment] = React.useState('');
    const [type, setType] = React.useState('plus');
    const [rating, setRating] = React.useState('');
    // const [rating, setRating] = React.useState(null);

    const { productId, productTitle } = route.params;

    const fetchData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', (errs, user) => {
            setUser(JSON.parse(user));
            setName(JSON.parse(user).name);
        }).then(() => {
            setIsLoading(false)
        })
    }

    React.useEffect(() => { }, [rating]);
    React.useEffect(fetchData, []);

    if (isLoading) {
        return (
            <Load />
        )
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
                <View style={{ padding: 20 }}>
                    <Text style={styles.title}>Новый отзыв на товар {productTitle}</Text>
                    <View style={{ marginBottom: 20, }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: colors.white }}>Оценка товара</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                            <TouchableOpacity onPress={() => { setRating(1) }}>
                                <Ionicons name='star' color={rating >= 1 ? colors.warning : 'silver'} size={50} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRating(2) }}>
                                <Ionicons name='star' color={rating >= 2 ? colors.warning : 'silver'} size={50} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRating(3) }}>
                                <Ionicons name='star' color={rating >= 3 ? colors.warning : 'silver'} size={50} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRating(4) }}>
                                <Ionicons name='star' color={rating >= 4 ? colors.warning : 'silver'} size={50} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRating(5) }}>
                                <Ionicons name='star' color={rating >= 5 ? colors.warning : 'silver'} size={50} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: colors.white, marginBottom: 16 }}>В целом Ваш отзыв</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={() => setType('plus')}>
                            <Checkbox
                                style={{ marginRight: 10, }}
                                value={type == 'plus'}
                                onValueChange={() => setType('plus')}
                                color={type == 'plus' ? colors.warning : undefined}
                            />
                            <Text style={{ fontSize: 18, color: colors.white }}>Положительный</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={() => setType('minus')}>
                            <Checkbox
                                style={{ marginRight: 10, }}
                                value={type == 'minus'}
                                onValueChange={() => setType('minus')}
                                color={type == 'minus' ? colors.warning : undefined}
                            />
                            <Text style={{ fontSize: 18, color: colors.white }}>Отрицаетльный</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Input label={'Имя'} value={name} onChange={value => setName(value)} />
                        <Input label={'Комментарий'} value={comment} onChange={value => setComment(value)} multi={true} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.warning }} onPress={() => {
                            let formData = new FormData();
                            formData.append('userId', user.id);
                            formData.append('name', name);
                            formData.append('comment', comment);
                            formData.append('rating', rating);
                            formData.append('type', type);

                            fetch(`${ApiUrl}catalog/${productId}/review`, {
                                method: 'post',
                                body: formData,
                            }).then(response => response.json()).then(response => {
                                console.log(response)
                                if (!response.ok) {
                                    let string = '';
                                    for (let err in response.data.errors) {
                                        string += '\n' + response.data.errors[err]
                                    }
                                    Alert.alert('Ошибка', string)
                                    return;
                                }
                                Alert.alert("", "Отзыв оставлен успешно", [
                                    {
                                        text: "ок",
                                        onPress: () => {
                                            navigation.navigate("Product", { productId: productId, refresh: true })
                                        }
                                    }
                                ]);
                            })
                        }}>
                            <Text style={{ color: colors.white }}>Оставить новый отзыв</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    title: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        fontWeight: 600,
        marginBottom: 30,
    }
})