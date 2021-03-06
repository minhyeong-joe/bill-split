import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";

import { commonStyles } from "../CommonStyles";
import CustomButton from "../components/CustomButton";
import InputGroup from "../components/InputGroup";
import ListItem from "../components/ListItem";

export default class ItemizedSplit extends Component {
  constructor(props) {
    super(props);
    const { items } = this.props.route.params;
    this.state = {
      // members: [{id: 0, name: 'John'}, {id: 1, name: 'Doe'} ...]
      members: [{ id: 0, name: "" }],
      tipPercent: "15.0",
      roundUp: false,
      showModal: false,
      curMemberId: 0,
      curSelectedItem: [],
      // memberItems: [{memId: 0, itemId: 0}, {memId: 0, itemId: 2}, {memId: 1, itemId: 1} ...]
      memberItems: [],
      items: items,
    };
  }

  onClickAddPerson = () => {
    let newMember = { id: this.state.members.length, name: "" };
    this.setState(prevState => ({
      members: [...prevState.members, newMember],
    }));
  };

  onChangeName = (name, id) => {
    let members = [...this.state.members];
    let i = members.findIndex(m => m.id == id);
    members[i].name = name;
    this.setState({
      members: members,
    });
  };

  onClickAddItem = id => {
    this.nameInput.blur();
    this.setState({
      showModal: true,
      curMemberId: id,
    });
  };

  onSelectItem = itemId => {
    let selected = [...this.state.curSelectedItem];
    let memberItems = [...this.state.memberItems];
    let curMemberId = this.state.curMemberId;
    // if item is already added to this member
    if (
      memberItems.filter(mi => mi.memId == curMemberId && mi.itemId == itemId)
        .length > 0
    ) {
      memberItems = memberItems.filter(
        mi => mi.memId != curMemberId || mi.itemId != itemId
      );
    }
    // otherwise,
    else {
      // if currently already selected
      if (selected.includes(itemId)) {
        // de-select
        selected.splice(selected.indexOf(itemId), 1);
      }
      // else
      else {
        // select
        selected.push(itemId);
      }
    }

    this.setState({
      memberItems: memberItems,
      curSelectedItem: selected,
    });
  };

  onModalClose = () => {
    // add selected items and selected member pair to memberItems
    let memberItems = [...this.state.memberItems];
    let memberId = this.state.curMemberId;
    for (let itemId of this.state.curSelectedItem) {
      memberItems.push({ memId: memberId, itemId: parseInt(itemId) });
    }

    this.setState({
      showModal: false,
      curSelectedItem: [],
      memberItems: memberItems,
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
    if (!this.allItemsAdded()) {
      Alert.alert("Incomplete", "There are still some unaccounted items", [
        { text: "OK" },
      ]);
    } else if (
      this.state.tipPercent == "" ||
      isNaN(parseFloat(this.state.tipPercent))
    ) {
      Alert.alert(
        "Incomplete",
        "You have to fill in Tip Percentage as valid number",
        [{ text: "OK" }]
      );
    } else {
      let data = {
        items: this.state.items,
        members: this.state.members,
        memberItems: this.state.memberItems,
        taxPercent: parseFloat(this.props.route.params.taxPercent),
        tipPercent: parseFloat(this.state.tipPercent),
        roundUp: this.state.roundUp,
      };

      this.props.navigation.navigate("ItemizedResultScreen", {
        data: data,
      });
    }
  };

  setItemColor = (memId, itemId) => {
    if (this.state.curSelectedItem.includes(itemId)) {
      return "#00FF00";
    }
    if (
      this.state.memberItems.filter(
        mi => mi.itemId == itemId && mi.memId == memId
      ).length > 0
    ) {
      return "#00FF00";
    }
    if (this.state.memberItems.findIndex(mi => mi.itemId == itemId) >= 0) {
      return "#FFE4B5";
    }
    return "#FFFFFF";
  };

  allItemsAdded = () => {
    // many-to-many between member and item, so use SET to remove duplicates
    let usedItems = [
      ...new Set(this.state.memberItems.map(pair => pair.itemId)),
    ];

    // if all items have been used, return true
    return usedItems.length == this.state.items.length;
  };

  render() {
    return (
      <View style={commonStyles.container}>
        <ScrollView
          style={{
            maxHeight: "80%",
            backgroundColor: "#eee",
            width: "90%",
            flex: 1,
          }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          {this.state.members.map(member => (
            <View
              style={{ width: "100%", paddingBottom: 10, marginTop: 8 }}
              key={member.id}
            >
              <View
                style={{ flexDirection: "row", width: "100%", marginBottom: 5 }}
              >
                <TextInput
                  ref={input => (this.nameInput = input)}
                  style={[
                    commonStyles.input,
                    {
                      flex: 2,
                      lineHeight: 24,
                      fontSize: 24,
                      marginHorizontal: 15,
                      fontWeight: "bold",
                    },
                  ]}
                  placeholder="Name"
                  onChangeText={name => this.onChangeName(name, member.id)}
                  value={member.name}
                  underlineColorAndroid="#999"
                  autoFocus={true}
                  onSubmitEditing={() => this.onClickAddItem(member.id)}
                />
                <CustomButton
                  text="Add Item"
                  style={{ flex: 1 }}
                  btnStyle={{ paddingVertical: 10, backgroundColor: "#7fff00" }}
                  disabled={member.name == ""}
                  onPress={() => this.onClickAddItem(member.id)}
                />
              </View>
              {this.state.memberItems
                .filter(memItems => memItems.memId == member.id)
                .map(memItems => {
                  let item = this.state.items.filter(
                    i => i.id == memItems.itemId
                  )[0];
                  return (
                    <ListItem
                      style={{ width: "85%", alignSelf: "center" }}
                      key={item.id}
                      item={item.item}
                      price={item.price}
                    />
                  );
                })}
            </View>
          ))}
          <View style={{ alignItems: "center" }}>
            <CustomButton
              text="+ Add Person"
              style={{ width: "80%" }}
              btnStyle={{ paddingVertical: 8 }}
              onPress={this.onClickAddPerson}
              disabled={
                this.state.members[this.state.members.length - 1].name == ""
              }
            />
          </View>
        </ScrollView>
        <InputGroup
          style={{ width: "50%", marginVertical: 20 }}
          label="Tip:"
          appendedText="%"
          onChangeText={tip => this.onChangeTip(tip)}
          value={this.state.tipPercent}
          keyboardType="numeric"
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
          style={{ width: "100%", marginTop: 8 }}
          btnStyle={{
            backgroundColor: "#08f26e",
            color: "#fff",
            borderRadius: 0,
          }}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showModal}
        >
          <View style={commonStyles.fullCenterContainer}>
            <View
              style={[
                commonStyles.fullCenterContainer,
                {
                  maxHeight: "75%",
                  width: "85%",
                  backgroundColor: "rgba(255,255,255,0.85)",
                },
              ]}
            >
              <Text style={{ marginVertical: 10, fontSize: 20 }}>
                Adding item for{" "}
                {this.state.members[this.state.curMemberId].name}
              </Text>
              <ScrollView style={{ width: "90%" }}>
                {this.state.items.map(item => (
                  <TouchableOpacity
                    onPress={() => this.onSelectItem(item.id)}
                    key={item.id}
                  >
                    <ListItem
                      item={item.item}
                      price={item.price}
                      style={{
                        backgroundColor: this.setItemColor(
                          this.state.curMemberId,
                          item.id
                        ),
                        paddingVertical: 10,
                        marginVertical: 0,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <CustomButton
                text="Done"
                style={{ width: "50%", marginBottom: 8 }}
                onPress={() => this.onModalClose()}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
