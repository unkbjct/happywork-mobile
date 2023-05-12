import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Image,
    StyleSheet,
    Text,
    Alert,
    View,
    Platform,
    Keyboard,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ApiUrl } from '../../config';
import { colors } from '../../components/mainStyles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Load } from '../../components/Load';

export default function AuthScreen({ navigation }) {

    let email = '';
    let password = '';

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 9, }}>
                <View style={styles.logo}>
                    <Image style={{ width: '100%', height: 100, resizeMode: 'contain' }} source={require('../../images/logo.png')} />
                </View>
                <Text style={styles.title}>Авторизация</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '100%' }}>
                        <Input label='Почта' value={email} onChange={value => email = value} />
                        <Input label='Пароль' secure={true} onChange={value => password = value} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <Button label={'Войти'} color={colors.warning} onPress={() => {
                                let formData = new FormData();
                                formData.append('email', email);
                                formData.append('passwd', password);

                                fetch(`${ApiUrl}user/login`, {
                                    method: 'post',
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
                                    AsyncStorage.setItem('user', JSON.stringify(response.data.user), () => {
                                        navigation.navigate("main")
                                    });

                                })
                            }} />
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={() => { navigation.navigate('Signup') }}>
                <Text style={styles.link} >Создать аккаунт</Text>
            </TouchableOpacity>

        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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