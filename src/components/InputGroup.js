import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import { commonStyles } from '../CommonStyles';

export default class InputGroup extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[{flexDirection: 'row'}, {...this.props.style}]}>
                <Text style={{flex:1}}>{this.props.label}</Text>
                <TextInput
                    ref={this.props.inputRef}
                    style={[commonStyles.input, {flex: this.props.width}]}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    keyboardType={this.props.keyboardType}
                    underlineColorAndroid={this.props.underlineColorAndroid}
                    autoFocus={this.props.autoFocus}
                    returnKeyType={this.props.returnKeyType}
                    blurOnSubmit={this.props.blurOnSubmit}
                    onSubmitEditing={this.props.onSubmitEditing}
                />
                {this.props.append !== '' ? <Text style={{flex:1}}>{this.props.append}</Text> :
            null}
            </View>
        );
    }
}

InputGroup.propTypes = {
    style: PropTypes.object,
    label: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    append: PropTypes.string,
    width: PropTypes.number,
    inputRef: PropTypes.func,
    autoFocus: PropTypes.bool,
    returnKeyType: PropTypes.string,
    blurOnSubmit: PropTypes.boolean,
    onSubmitEditing: PropTypes.func
}

InputGroup.defaultProps = {
    label: '',
    placeholder: '',
    keyboardType: 'default',
    underlineColorAndroid: '#999',
    append: '',
    width: 2,
    autoFocus: false,
    blurOnSubmit: true
}