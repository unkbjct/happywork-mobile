import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SiteUrl } from '../config';
import { colors } from './mainStyles';

export default class CategoryCard extends React.Component {
    constructor(props) {
        super(props)
        this.category = props.category;
        this.onPress = props.onPress;
    }

    render() {
        return (
            <View style={styles.ContainerCard}>
                <TouchableOpacity style={styles.contentCard} onPress={() => this.onPress(this.category.title_eng)}>
                    <View style={styles.titleView}>
                        <Text style={styles.title}>{this.category.title}</Text>
                    </View>
                    <View style={styles.imageView}>
                        <Image style={styles.image} source={{ uri: `${SiteUrl}${this.category.image}` }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ContainerCard: {
        padding: 5,
        width: '50%'
    },
    contentCard: {
        backgroundColor: colors.white,
        borderRadius: 2,
    },
    titleView: {
        borderBottomWidth: 1,
        borderColor: 'silver',
        height: 60,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 18
        // height: 200,
    },
    imageView: {
        padding: 10,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    }
})