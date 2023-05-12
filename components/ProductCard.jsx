import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from './mainStyles';
import { SiteUrl } from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ProductCard extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.product = props.product;
        this.favorites = props.favorites;
        this.state.isFavorite = this.favorites.includes(this.product.id);
        // this.isFavorite = props.isFavorite;
    }

    favorite() {
        if (this.state.isFavorite) {
            this.favorites.splice(this.favorites.findIndex(e => e == this.product.id), 1);
            AsyncStorage.setItem('favorites', JSON.stringify(this.favorites));
        } else {
            this.favorites.push(this.product.id)
            AsyncStorage.setItem('favorites', JSON.stringify(this.favorites))
        }
        this.setState({ isFavorite: !this.state.isFavorite })
    }

    state = {
        isFavorite: false,
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.content} onPress={() => this.navigation.navigate("Product", { "productId": this.product.id })}>
                    <TouchableOpacity style={styles.btnFavorite} onPress={() => { this.favorite() }}>
                        <Ionicons size={20} name={this.state.isFavorite ? 'heart' : 'heart-outline'} color={colors.warning} />
                    </TouchableOpacity>
                    <Image style={styles.image} source={{ uri: `${SiteUrl}${this.product.image}` }} />
                    <Text numberOfLines={1} style={styles.title}>{this.product.title}</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                        <Ionicons size={15} name={'star'} color={this.product.rating >= 1 ? colors.warning : 'silver'} />
                        <Ionicons size={15} name={'star'} color={this.product.rating >= 2 ? colors.warning : 'silver'} />
                        <Ionicons size={15} name={'star'} color={this.product.rating >= 3 ? colors.warning : 'silver'} />
                        <Ionicons size={15} name={'star'} color={this.product.rating >= 4 ? colors.warning : 'silver'} />
                        <Ionicons size={15} name={'star'} color={this.product.rating >= 5 ? colors.warning : 'silver'} />
                    </View>
                    {this.product.sale ?
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={styles.oldPrice}>{priceFormat(this.product.price)}</Text>
                            <Text style={styles.newPrice}>{priceFormat(this.product.sale)}</Text>
                        </View>
                        :
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.price}>{priceFormat(this.product.price)}</Text>
                        </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }
}

function priceFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ₽.'
}

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 5,
    },
    btnFavorite: {
        position: 'absolute',
        borderWidth: 1,
        top: 5,
        right: 5,
        padding: 5,
        borderColor: 'silver',
        backgroundColor: colors.white,
        zIndex: 5,
    },
    content: {
        // borderWidth: 1,
        padding: 10,
        borderRadius: 2,
        position: 'relative',
        backgroundColor: colors.white,
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'contain',
    },
    title: {
        // fontSize: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 500,
        marginTop: 'auto',
    },
    oldPrice: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        color: 'gray'
    },
    newPrice: {
        fontSize: 20,
        fontWeight: 500
    },
})