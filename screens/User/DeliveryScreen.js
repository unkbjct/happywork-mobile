import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DeliveryScreen({ navigation }) {
    // const []
    return (
        <ScrollView style={{ backgroundColor: colors.dark }}>
            <View style={{ marginTop: 25 }}>
                <View style={{ padding: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                    <Ionicons name='cube' size={70} color={colors.warning} />
                    <Text style={{ fontSize: 24, color: colors.white, marginTop: 15 }}>Доставка</Text>
                </View>
                <View>
                    <View style={styles.listItem}>
                        <Text style={styles.title}>Вариант 1: Курьером в черте города</Text>
                        <Text style={styles.semiTitle}>Стоимость доставки зависит от суммы заказа</Text>
                        <Text style={styles.text}>Для заказов больше <Text style={{ fontWeight: 500 }}>500 рублей</Text> - доставка <Text style={{ fontWeight: 500 }}>0 рублей</Text></Text>
                        <Text style={styles.text}>Для заказов меньше <Text style={{ fontWeight: 500 }}>500 рублей</Text> - доставка <Text style={{ fontWeight: 500 }}>0 рублей</Text></Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.title}>Вариант 2: Самовывоз ТЦ "Мармелад"</Text>
                        <Text style={styles.text}>Великий Новгород, ул. Ломоносова, 29, ТЦ "Мармелад" 1 этаж</Text>
                        <Text style={styles.text}>Стоимость доставки:  <Text style={{ fontWeight: 500 }}>0 рублей</Text> </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.title}>Вариант 3: Курьером по Новгородской области</Text>
                        <Text style={styles.text}>Стоимость доставки:  <Text style={{ fontWeight: 500 }}>500 рублей</Text> </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.title}>Вариант 4: Самовывоз ТД "Русь"</Text>
                        <Text style={styles.text}>Великий Новгород, ул. Большая Санкт-Петербургская, 25. ТД "Русь"</Text>
                        <Text style={styles.text}>Стоимость доставки:  <Text style={{ fontWeight: 500 }}>0 рублей</Text> </Text>
                    </View>
                </View>
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: colors.moreDark,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 22,
        color: colors.white,
        marginBottom: 20,
    },
    semiTitle: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 500,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: colors.white,
        marginBottom: 10,
    }
})