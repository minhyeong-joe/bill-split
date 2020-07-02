import React, { Component } from "react";
import { View, Text, Switch } from "react-native";

import { commonStyles } from "../CommonStyles";
import CustomButton from "../components/CustomButton";
import InputGroup from "../components/InputGroup";

export default class EvenSplit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numParty: "",
      tipPercent: "15.0",
      roundUp: false,
    };
  }

  onChangePartyNumber = num => {
    this.setState({
      numParty: num,
    });
  };

  onChangeTip = tipPercent => {
    this.setState({
      tipPercent: tipPercent,
    });
  };

  onSwitchRoundUp = val => {
    this.setState({
      roundUp: val,
    });
  };

  onClickSplit = () => {
    const { items, taxPercent } = this.props.route.params;

    let data = {
      items: items,
      taxPercent: parseFloat(taxPercent),
      numParty: parseInt(this.state.numParty),
      tipPercent: parseFloat(this.state.tipPercent),
      roundUp: this.state.roundUp,
    };

    this.props.navigation.navigate("EvenResultScreen", {
      data: data,
    });
  };

  render() {
    return (
      <View style={commonStyles.container}>
        <InputGroup
          style={{ width: "50%", marginVertical: 20 }}
          label="# of Party:"
          onChangeText={numParty => this.onChangePartyNumber(numParty)}
          value={this.state.numParty}
          keyboardType="number-pad"
          inputRef={input => (this.numPartyInput = input)}
          autoFocus={true}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => this.tipInput.focus()}
        />
        <InputGroup
          style={{ width: "50%", marginVertical: 20 }}
          label="Tip:"
          appendedText="%"
          onChangeText={tip => this.onChangeTip(tip)}
          value={this.state.tipPercent}
          inputRef={input => (this.tipInput = input)}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={this.onClickSplit}
        />
        <View style={{ flexDirection: "row", marginVerical: 20 }}>
          <Switch
            onValueChange={val => this.onSwitchRoundUp(val)}
            value={this.state.roundUp}
          />
          <Text>Round Up the Total</Text>
        </View>
        <CustomButton
          text="Split!"
          onPress={this.onClickSplit}
          disabled={
            this.state.numParty == "" ||
            this.state.tipPercent == "" ||
            isNaN(parseFloat(this.state.tipPercent))
          }
          style={{ width: "100%", marginTop: 10 }}
          btnStyle={{
            backgroundColor: "#08f26e",
            color: "#fff",
            borderRadius: 0,
          }}
        />
      </View>
    );
  }
}
