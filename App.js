import { SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import { colors } from './components/mainStyles';

export default function App() {
    StatusBar.setBarStyle('dark-content', true)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.moreDark }}>

            <StatusBar
                translucent
                barStyle={'light-content'}
            // shidden={true}
            />
            <MainNavigation />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});