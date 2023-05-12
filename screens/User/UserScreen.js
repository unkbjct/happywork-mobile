import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Load } from '../../components/Load';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UserScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState(null);

    const fetchData = () => {
        setIsLoading(true)
        AsyncStorage.getItem('user', async (errs, user) => {
            user = JSON.parse(user)
            setUser(user)
        }).finally(() => { setIsLoading(false) });
    }

    React.useEffect(fetchData, []);

    if (isLoading) {
        return (
            <Load />
        )
    }

    if (route.params && route.params.refresh == true) {

        route.params.refresh = undefined;
        fetchData();
    }
    return (

        <View style={{ backgroundColor: colors.dark, flex: 1 }}>
            <View style={{ padding: 20, borderBottomColor: 'gray', borderBottomWidth: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: colors.moreDark }}>
                <Ionicons name='person-circle' size={70} color={colors.white} />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={{ color: 'silver', fontSize: 16, marginTop: 10 }}>{user.phone}</Text>
            </View>
            <ScrollView style={{ backgroundColor: colors.moreDark }} >
                <View style={[styles.section, { marginBottom: 20 }]}>
                    <Text style={styles.title}>Личное</Text>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Favorites")}>
                        <Text style={styles.textBtn}>Избранное</Text>
                        <Ionicons name='heart' size={20} color={colors.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("History")}>
                        <Text style={styles.textBtn}>История</Text>
                        <Ionicons name='reorder-three' size={20} color={colors.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Repair")}>
                        <Text style={styles.textBtn}>Заявка на ремонт</Text>
                        <Ionicons name='build' size={20} color={colors.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Edit")}>
                        <Text style={styles.textBtn}>Редактировать профиль</Text>
                        <Ionicons name='cog' size={20} color={colors.warning} />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Информация</Text>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Delivery")}>
                        <Text style={styles.textBtn}>Доставка</Text>
                        <Ionicons name='cube' size={20} color={colors.warning} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Contacts")}>
                        <Text style={styles.textBtn}>Контакты</Text>
                        <Ionicons name='call' size={20} color={colors.warning} />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.btn} onPress={() => {
                        Alert.alert("Подтвердите действие", "Вы действительно хотите выйти?", [
                            {
                                text: "Да, Выйти",
                                style: { fontWeight: 700 },
                                onPress: async () => {
                                    await AsyncStorage.removeItem("user");
                                    navigation.navigate("auth");
                                }
                            },
                            {
                                text: "Нет, Отмена",
                            }
                        ])
                    }}>
                        <Text style={styles.textBtn}>Выход</Text>
                        <Ionicons name='exit' size={20} color={colors.warning} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    name: {
        fontSize: 25,
        color: 'white'
    },
    section: {
        backgroundColor: colors.dark,
        marginBottom: 20,
        paddingVertical: 15,
    },
    title: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 700,
        color: colors.white
    },
    textBtn: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 300,
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderBottomWidth: 1,
    }
})