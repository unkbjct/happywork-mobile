import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Load } from '../../components/Load';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../components/mainStyles';
import { Alert, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Input from '../../components/Input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApiUrl } from '../../config';

export default function EditScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [name, setName] = React.useState();
    const [phone, setPhone] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [secure, setSecure] = React.useState(true);

    const fetchData = () => {
        setIsLoading(true);

        AsyncStorage.getItem("user", (errs, user) => {
            user = JSON.parse(user);
            setUser(user);
            setName(user.name);
            setPhone(user.phone);
            setEmail(user.email);
            setPassword(user.passwd);
        }).finally(() => setIsLoading(false));
    }

    React.useEffect(fetchData, []);

    if (isLoading) return <Load />

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: colors.dark }} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}>
            <View style={{ padding: 20 }}>
                <Input label={"Имя"} value={name} onChange={value => setName(value)} />
                <Input label={"Телефон"} value={phone} onChange={value => setPhone(value)} />
                <Input label={"Почта"} value={email} onChange={value => setEmail(value)} />
                <View style={{ marginBottom: 20, width: '100%' }} >
                    <Text style={{ color: colors.white, fontSize: 20, marginBottom: 10 }}>Пароль</Text>
                    <View style={[styles.Container,]}>
                        <TextInput
                            onChangeText={value => setPassword(value)}
                            secureTextEntry={secure}
                            style={styles.Input}>{password}</TextInput>
                        <TouchableOpacity style={{ flex: 1, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'gray' }} onPress={() => {
                            setSecure((prev) => !prev)
                        }}>
                            <Ionicons style={{}} name={secure ? 'eye' : 'eye-off'} size={30} color={colors.moreDark} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.moreDark, marginRight: 10, }} onPress={() => navigation.navigate("User")}>
                        <Text style={{ color: colors.white }}>Отмена</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.warning, }} onPress={async () => {
                        if (user.name == name && user.phone == phone && user.email == email && user.passwd == password) return

                        let formData = new FormData();
                        formData.append("api_token", user.api_token);
                        formData.append("name", name);
                        formData.append("phone", phone);
                        formData.append("email", email);
                        formData.append("passwd", password);
                        await fetch(`${ApiUrl}user/edit/personal`, {
                            method: "post",
                            body: formData
                        }).then(response => response.json()).then(response => {
                            console.log(response)
                            if (!response.ok) {
                                let string = '';
                                console.log(response.data.errors)
                                for (let err in response.data.errors) {
                                    string += response.data.errors[err] + '\n'
                                }
                                Alert.alert(string)
                                return;
                            }
                            Alert.alert(response.message, "", [{
                                text: "Ок",
                                onPress: async () => {
                                    await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
                                    navigation.navigate("User", { "refresh": true });
                                }
                            }])
                        })
                    }}>
                        <Text>Сохранить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView >
    )
}

const styles = StyleSheet.create({
    Container: {
        borderWidth: 1,
        borderColor: 'silver',
        marginBottom: 10,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',

    },
    ContainerFocus: {
        borderWidth: 1,
        borderColor: colors.warning,
        marginBottom: 10,
        width: '100%',
        backgroundColor: 'white'
    },
    LabelView: {
        zIndex: 0,
        borderWidth: 1,
        alignItems: 'flex-start',
    },
    LabelText: {
        color: 'rgb(40, 40, 40)',
        fontSize: 20,
    },
    InputView: {
    },
    Input: {
        fontSize: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 2,
        flex: 9
    },
    multi: {
        height: 100,
    }
})