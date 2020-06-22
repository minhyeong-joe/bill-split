import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableNativeFeedback
                onPress={this.props.onPress}
                background={TouchableNativeFeedback.SelectableBackground()}
                disabled={this.props.disabled}
            >
                <View style={{ 
                    backgroundColor: this.props.disabled? '#aaa': this.props.backgroundColor, 
                    width: this.props.width,
                    paddingVertical: this.props.paddingVertical, 
                    marginVertical: this.props.marginVertical, 
                    borderRadius: 5 
                }}>
                    <Text style={{ color: this.props.color, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>{this.props.text}</Text>
                </View>

            </TouchableNativeFeedback>
        );
    }

}

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    width: PropTypes.string,
    paddingVertical: PropTypes.number,
    marginVertical: PropTypes.number,
    disabled: PropTypes.bool
}

CustomButton.defaultProps = {
    onPress: () => { },
    backgroundColor: '#87CEEB',
    color: '#000',
    width: '100%',
    paddingVertical: 20,
    marginVertical: 10,
    disabled: false
}
