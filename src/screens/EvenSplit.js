import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';

import { commonStyles} from '../CommonStyles';
import CustomButton from '../components/CustomButton';
import InputGroup from '../components/InputGroup';

export default class EvenSplit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numParty: '',
      tipPercent: '15.0',
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

  onChangeTip(tipPercent) {
    this.setState({
      tipPercent: tip
    });
  }

  onSwitchRoundUp(val) {
    this.setState({
      roundUp: val
    });
  }

  onClickSplit() {
    const { items, taxPercent } = this.props.route.params;

    let data = {
      items: items,
      taxPercent: parseFloat(taxPercent),
      numParty: parseInt(this.state.numParty),
      tipPercent: parseFloat(this.state.tipPercent),
      roundUp: this.state.roundUp
    };

    this.props.navigation.navigate('EvenResultScreen', {
      data: data
    });
  }

  render() {
    return (
      <View style={commonStyles.container}>
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
          value={this.state.tipPercent}
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
          disabled={this.state.numParty == '' || this.state.tipPercent == ''}
          width="50%"
        />
      </View>
    );
  }

}
