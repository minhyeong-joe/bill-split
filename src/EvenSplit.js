import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { commonStyles} from './common/CommonStyles';
import CustomButton from './common/CustomButton';
import InputGroup from './common/InputGroup';

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
      <SafeAreaView style={commonStyles.container}>
        <InputGroup 
          style={{width: '50%', marginVertical: 20}}
          label="# of Party:"
          onChangeText={numParty => this.onChangePartyNumber(numParty)}
          value={this.state.numParty}
          keyboardType="number-pad"
          width={1.5}
        />
        <InputGroup 
          style={{width: '50%', marginVertical: 20}}
          label="Tip:"
          append="%"
          onChangeText={tip => this.onChangeTip(tip)}
          value={this.state.tip}
          keyboardType="numeric"
        />
        <View style={{flexDirection:'row', marginVerical:20}}>
          <Switch
            onValueChange={(val) => this.onSwitchRoundUp(val)}
            value={this.state.roundUp}
          />
          <Text>Round Up the Total</Text>
        </View>
        <CustomButton
          text="Split!"
          onPress={() => this.onClickSplit()}
          disabled={this.state.numParty == '' || this.state.tip == ''}
          width="50%"
        />
      </SafeAreaView>
    );
  }

}
