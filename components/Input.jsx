import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Animated,
    Easing
} from 'react-native';
import { colors } from './mainStyles';

export default class Input extends React.Component {
    constructor(props) {
        super(props)
        this.label = props.label;
        this.value = props.value;
        this.help = props.help;
        this.secure = (props.secure) ? props.secure : false;
        this.setValue = props.onChange;
        this.multi = props.multi;
    }



    state = {
        stylesContainer: styles.Container,
        stylesLabel: styles.LabelText,
    }

    onFocus() {
        this.setState({
            stylesContainer: styles.ContainerFocus,
        })
    }

    onBlur() {
        this.setState({
            stylesContainer: styles.Container,
        })
    }



    render() {
        return (
            <View style={{ marginBottom: 20, width: '100%' }} >
                <Text style={{ color: colors.white, fontSize: 20, marginBottom: 10 }}>{this.label}</Text>
                <View style={[this.state.stylesContainer,]}>
                    <TextInput
                        multiline={this.multi ? true : false}
                        onBlur={() => this.onBlur()}
                        onFocus={() => this.onFocus()}
                        onChangeText={value => {
                            if (this.setValue) {
                                this.setValue(value)
                            }
                        }}
                        secureTextEntry={this.secure}
                        style={[styles.Input, this.multi ? styles.multi : {}]}>{this.value}</TextInput>
                </View>
                {(this.help) ? <Text style={{ color: 'rgb(150, 150, 150)' }}>{this.help}</Text> : <></>}
            </View >
        )
    }
}
const styles = StyleSheet.create({
    Container: {
        borderWidth: 1,
        borderColor: 'silver',
        marginBottom: 10,
        width: '100%',
        backgroundColor: 'white'
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
    },
    multi: {
        height: 100,
    }
})