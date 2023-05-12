import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../components/mainStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ({ navigation }) {
    return (
        <ScrollView style={{ backgroundColor: colors.dark }}>
            <View style={{ marginTop: 25 }}>
                <View style={{ padding: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                    <Ionicons name='map' size={70} color={colors.warning} />
                    <Text style={{ fontSize: 24, color: colors.white, marginTop: 15 }}>Контакты</Text>
                </View>
                <View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} name='location' size={30} color={colors.warning} />
                        <Text style={styles.text}>Россия, Великий Новгород, ул. Большая Санкт-Петербургская, 25. ТД "Русь"</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} name='location' size={30} color={colors.warning} />
                        <Text style={styles.text}>Россия, Великий Новгород, ул. Ломоносова, 29. ТЦ "МАРМЕЛАД"</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} name='time' size={30} color={colors.warning} />
                        <Text style={styles.text}>ТД "Русь ПН-ВС 10:00-21:00, ТЦ "МАРМЕЛАД" Пн-Вс 10:00-21:00</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} name='call' size={30} color={colors.warning} />
                        <Text style={styles.text}>+7(921)020-98-88</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons style={styles.icon} name='mail' size={30} color={colors.warning} />
                        <Text style={styles.text}>happywork@yandex.ru</Text>
                    </View>
                </View>
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: colors.moreDark,
        flexDirection: 'row',
        // alignItems: ',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 25,
    },
    text: {
        fontSize: 20,
        color: colors.white,
    },
    icon: {
        marginRight: 10,
    }
})