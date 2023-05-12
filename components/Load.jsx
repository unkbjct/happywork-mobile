import { Text, View, ActivityIndicator } from 'react-native';
import { colors } from './mainStyles';

export const Load = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.dark
            }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 15, color: 'white' }}>Загрузка...</Text>
        </View>
    );
};