import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.label = props.label;
        this.color = props.color;
        this.onPress = props.onPress;
    }

    render() {
        return (
            <TouchableOpacity style={[styles.btn, { backgroundColor: this.color }]} onPress={() => { this.onPress() }}>
                <Text styles={[styles.label]}>{this.label}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    label: {
    }
})