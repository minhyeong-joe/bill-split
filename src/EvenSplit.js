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
    total = subtotal + tax + tip;
    // round up?
    if (this.state.roundUp) {
      tip += parseFloat((Math.ceil(total) - total).toFixed(2));
      tipPercent = parseFloat(((tip/subtotal)*100).toFixed(2));
      total = Math.ceil(total);
    }

    let result = {
      items: items,
      taxPercent: parseFloat(taxPercent),
      tax: tax,
      numParty: this.state.numParty,
      tip: parseFloat(tip.toFixed(2)),
      tipPercent: tipPercent,
      subtotal: subtotal,
      total: parseFloat(total.toFixed(2)),
      roundUp: this.state.roundUp
    };

    console.log(result);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text># of Party: </Text>
          <TextInput
            onChangeText={(text) => {this.onChangePartyNumber(text)}}
            value={this.state.numParty}
            keyboardType="number-pad"
          />
        </View>
        <View>
          <Text>Tip: </Text>
          <View>
            <TextInput
              onChangeText={(text) => {this.onChangeTip(text)}}
              value={this.state.tip}
              keyboardType="numeric"
            />
            <Text>%</Text>
          </View>
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
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
