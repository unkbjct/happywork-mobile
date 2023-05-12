import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    Alert,
    View,
    Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ApiUrl } from '../../config';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../components/mainStyles';


export default function SignupScreen({ navigation }) {
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: colors.dark }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image style={{ width: '100%', height: 100, resizeMode: 'contain' }} source={require('../../images/logo.png')} />
                </View>
                <Text style={styles.title}>Регистрация</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '100%' }}>
                        <Input help={'Обязательно'} label='Имя' value={name} onChange={value => setName(value)} />
                        <Input help={'Обязательно'} label='Телефон' value={phone} onChange={value => setPhone(value)} />
                        <Input help={'Обязательно'} label='Почта' value={email} onChange={value => setEmail(value)} />
                        <Input help={'Обязательно'} label='Пароль' value={password} secure={true} onChange={value => setPassword(value)} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.warning }} onPress={async () => {
                                let formData = new FormData();
                                formData.append("name", name);
                                formData.append("phone", phone);
                                formData.append("email", email);
                                formData.append("passwd", password);
                                fetch(`${ApiUrl}user/create`, {
                                    method: "post",
                                    body: formData,
                                }).then(response => response.json()).then(async response => {
                                    if (!response.ok) {
                                        let string = '';
                                        console.log(response.data.errors)
                                        for (let err in response.data.errors) {
                                            string += response.data.errors[err] + '\n'
                                        }
                                        Alert.alert(string)
                                        return;
                                    }
                                    console.log(response.data.user)
                                    await AsyncStorage.removeItem("cart")
                                    await AsyncStorage.removeItem("favorites")
                                    await AsyncStorage.setItem('user', JSON.stringify(response.data.user), () => {
                                        navigation.navigate("main", { "refresh": true })
                                    });

                                })
                            }}>
                                <Text>Создать аккаунт</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{ marginTop: 30 }} onPress={() => { navigation.navigate('Auth') }}>
                    <Text style={styles.link} >Войти в аккаунт</Text>
                </TouchableOpacity>
            </View>


        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.dark,
        color: 'white',
        flexDirection: 'column',
        padding: 20,
    },
    logo: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
    },
    link: {
        color: 'silver',
        textAlign: 'center',
    }
})