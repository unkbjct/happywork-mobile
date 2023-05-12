import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Load } from '../../components/Load';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../components/mainStyles';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../../components/Input';
import { ApiUrl } from '../../config';

export default function RepairScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [name, setName] = React.useState();
    const [phone, setPhone] = React.useState();
    const [mobile, setMobile] = React.useState();
    const [description, setDescription] = React.useState();

    const fetchData = () => {
        setIsLoading(true);
        AsyncStorage.getItem("user", (errs, user) => {
            user = JSON.parse(user);
            setUser(user);
            setName(user.phone);
            setPhone(user.phone);
        }).finally(() => setIsLoading(false))
    }

    React.useEffect(fetchData, []);

    if (isLoading) return <Load />;

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: colors.dark }}>
            <View style={{ padding: 20, paddingTop: 30, }}>
                <View style={{ marginBottom: 50 }}>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} size={40} name={'build'} color={colors.warning} />
                        <Text style={styles.text}>Ремонт любой сложности</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} size={40} name={'time'} color={colors.warning} />
                        <Text style={styles.text}>Починим в кратчайшие сроки</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} size={40} name={'wallet'} color={colors.warning} />
                        <Text style={styles.text}>Оплата по карте или наличными</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} size={40} name={'shield-checkmark'} color={colors.warning} />
                        <Text style={styles.text}>Гарантия 1 год на все работы</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} size={40} name={'wifi'} color={colors.warning} />
                        <Text style={styles.text}>Комфортная зона ожидания с WiFi</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 24, textAlign: 'center', color: colors.white, marginBottom: 30, }}>Заполните форму и мы вам перезвоним</Text>
                    <Input label={'Имя *'} value={name} onChange={value => setName(value)} />
                    <Input label={'Телефон *'} value={phone} onChange={value => setPhone(value)} />
                    <Input label={'Модель телефон'} value={mobile} onChange={value => setMobile(value)} />
                    <Input label={'Описание проблемы'} value={description} onChange={value => setDescription(value)} multi={true} />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ marginBottom: 20, fontSize: 18, color: 'silver' }}>* - Обязательные поля</Text>
                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.warning }} onPress={async () => {
                            let formData = new FormData();
                            formData.append("name", name);
                            formData.append("phone", phone);
                            formData.append("mobile", mobile);
                            formData.append("description", description);
                            await fetch(`${ApiUrl}repair/applicant`, {
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
                                Alert.alert(response.message, "", [{
                                    text: "Ок",
                                    onPress: () => {
                                        navigation.navigate("User");
                                    }
                                }])
                            })
                        }}>
                            <Text>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    text: {
        fontSize: 20,
        color: colors.white,
        flex: 5,
        paddingLeft: 10,
    },
    icon: {
        marginRight: 0,
        flex: 1,
    }
})