import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                disabled={this.props.disabled}
                style={[{width: '100%'}, {...this.props.style}]}
                underlayColor="transparent"
                activeOpacity={0.7}
            >
                <View style={[styles.defaultBtn, {...this.props.btnStyle}, this.props.disabled? {backgroundColor: '#aaa'}: {}]}>
                    <Text style={[styles.defaultTxt, {...this.props.textStyle}]}>{this.props.text}</Text>
                </View>

            </TouchableHighlight>
        );
    }

}

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    btnStyle: PropTypes.object,
    textStyle: PropTypes.object
}

CustomButton.defaultProps = {
    disabled: false
}

const styles = StyleSheet.create({
    defaultBtn: {
        backgroundColor: '#87CEEB',
        width: '100%',
        paddingVertical: 15,
        elevation: 5,
        borderRadius: 10
    },
    defaultTxt: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});