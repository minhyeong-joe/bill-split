import React, { Component } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from './common/CustomButton';

export default class EvenSplit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numParty: '',
      tip: '15.0',
      roundUp: false
    };
    this.onChangePartyNumber = this.onChangePartyNumber.bind(this);
    this.onChangeTip = this.onChangeTip.bind(this);
    this.onSwitchRoundUp = this.onSwitchRoundUp.bind(this);
    this.onClickSplit = this.onClickSplit.bind(this);
    this.divisibleByN = this.divisibleByN.bind(this);
  }

  onChangePartyNumber(num) {
    this.setState({
      numParty: num
    });
  }

  onChangeTip(tip) {
    this.setState({
      tip: tip
    });
  }

  onSwitchRoundUp(val) {
    this.setState({
      roundUp: val
    });
  }

  onClickSplit() {
    const { items, taxPercent } = this.props.route.params;
    let subtotal = 0;
    let tip = 0;
    let tipPercent = 0;
    let tax = 0;
    let total = 0;
    items.forEach((item) => {
      subtotal += item.price;
    });
    subtotal = parseFloat(subtotal.toFixed(2));
    // pre-tax tip
    tip = parseFloat((subtotal * this.state.tip/100).toFixed(2));
    tipPercent = parseFloat(this.state.tip);
    // add tax and tip
    tax = parseFloat((subtotal * parseFloat(taxPercent)/100).toFixed(2));
    total = parseFloat((subtotal + tax + tip).toFixed(2));
    // round up?
    if (this.state.roundUp) {
      let oldTotal = total;
      total = this.divisibleByN(total, parseInt(this.state.numParty));
      tip = parseFloat((tip + total - oldTotal).toFixed(2));
      tipPercent = parseFloat(((tip/subtotal)*100).toFixed(1));
    }

    let result = {
      items: items,
      taxPercent: parseFloat(taxPercent),
      tax: tax,
      numParty: parseInt(this.state.numParty),
      tip: tip,
      tipPercent: tipPercent,
      subtotal: subtotal,
      total: total,
      roundUp: this.state.roundUp
    };

    this.props.navigation.navigate('ResultScreen', {
      result: result
    });
  }

  divisibleByN(price, n) {
    let quotient = price/n;
    let roundedQuotient = Math.round(quotient);
    return roundedQuotient * n;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.inputGroup}>
          <Text># of Party: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {this.onChangePartyNumber(text)}}
            value={this.state.numParty}
            keyboardType="number-pad"
            underlineColorAndroid="#999"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Tip: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {this.onChangeTip(text)}}
            value={this.state.tip}
            keyboardType="numeric"
            underlineColorAndroid="#999"
          />
          <Text>%</Text>
        </View>
        <View style={styles.inputGroup}>
          <Switch
            onValueChange={(val) => this.onSwitchRoundUp(val)}
            value={this.state.roundUp}
          />
          <Text>Round Up the Total</Text>
        </View>
        <CustomButton
          text="Split!"
          onPress={() => this.onClickSplit()}
          disabled={this.state.numParty == ''}
          width="50%"
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  inputGroup: {
      flexDirection: 'row',
      marginVertical: 20
  },
  input: {
    width: '25%',
    paddingBottom: 8,
    marginLeft: 10
  },
});
