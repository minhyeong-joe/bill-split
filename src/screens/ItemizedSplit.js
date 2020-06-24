import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, Switch, Modal, TouchableHighlight, StyleSheet } from 'react-native';

import { commonStyles } from '../CommonStyles';
import CustomButton from '../components/CustomButton';
import InputGroup from '../components/InputGroup';

export default class ItemizedSplit extends Component {
    
    constructor(props) {
        super(props);
        const { items } = this.props.route.params;
        this.state = {
            // members: [{id: 0, name: 'John'}, {id: 1, name: 'Doe'} ...]
            members: [{id: 0, name: ''}],
            tip: '15.0',
            roundUp: false,
            showModal: false,
            curMemberId: 0,
            curSelectedItem: [],
            // memberItems: [{memId: 0, itemId: 0}, {memId: 0, itemId: 2}, {memId: 1, itemId: 1} ...]
            memberItems: [],
            items: items
        };
        this.onChangeTip = this.onChangeTip.bind(this);
        this.onSwitchRoundUp = this.onSwitchRoundUp.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onClickAddPerson = this.onClickAddPerson.bind(this);
        this.onClickAddItem = this.onClickAddItem.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.setItemColor = this.setItemColor.bind(this);

        console.log(this.state);
        
    }

    onClickAddPerson() {
        let newMember = {id: this.state.members.length, name: ''};
        this.setState(prevState => ({
            members: [...prevState.members, newMember]
        }));
    }

    onChangeName(name, id) {
        let members = [...this.state.members];
        let i = members.findIndex(m => m.id == id);
        members[i].name = name;
        this.setState({
            members: members
        });
    }

    onClickAddItem(id) {
        this.setState({
            showModal: true,
            curMemberId: id
        });
    }

    onSelectItem(itemId) {
        let selected = [...this.state.curSelectedItem];
        let memberItems = [...this.state.memberItems];
        let curMemberId = this.state.curMemberId;
        // if item is already added to this member
        if (memberItems.filter(mi => mi.memId == curMemberId && mi.itemId == itemId).length > 0) {
            memberItems = memberItems.filter(mi => mi.memId != curMemberId && mi.itemId != itemId);
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
            curSelectedItem: selected
        });
    }

    onModalClose() {
        // add selected items and selected member pair to memberItems
        let memberItems = [...this.state.memberItems];
        let memberId = this.state.curMemberId;
        for (let itemId of this.state.curSelectedItem) {
            memberItems.push({memId: memberId, itemId: parseInt(itemId)});
        }
        
        this.setState({
            showModal:false,
            curSelectedItem: [],
            memberItems: memberItems
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

    setItemColor(memId, itemId) {
        if (this.state.curSelectedItem.includes(itemId)) {
            return styles.selected;
        }
        if (this.state.memberItems.filter(mi => mi.itemId == itemId && mi.memId == memId).length > 0) {
            return styles.selected;
        }
        if (this.state.memberItems.findIndex(mi => mi.itemId == itemId) >= 0) {
            return styles.added;
        }
        return {};
    }

    render() {
        return (
            <View style={commonStyles.container}>
                <ScrollView style={{maxHeight: '80%', backgroundColor:'#eee', width: '90%', flex:1}} keyboardShouldPersistTaps="always">
                    {this.state.members.map(member => (
                        <View style={{width:'100%', paddingBottom: 10}} key={member.id}>
                            <View style={{flexDirection:'row', width:'100%'}}>
                                <TextInput
                                    style={[commonStyles.input, {flex:3, lineHeight:24, fontSize: 24, marginHorizontal: 15, fontWeight:'bold'}]}
                                    placeholder="Name"
                                    onChangeText={(name) => this.onChangeName(name, member.id)}
                                    value={member.name}
                                    underlineColorAndroid="#999"
                                    autoFocus={true}
                                    onSubmitEditing={() => this.onClickAddItem(member.id)}
                                />
                                <CustomButton 
                                    text="Add Item"
                                    width="30%"
                                    style={{flex:1}}
                                    paddingVertical={10}
                                    backgroundColor="#7FFF00"
                                    disabled={member.name == ''}
                                    onPress={()=>this.onClickAddItem(member.id)}
                                />
                            </View>
                            {this.state.memberItems
                                .filter(memItems => memItems.memId == member.id)
                                .map(memItems => {
                                    let item = this.state.items.filter(i => i.id == memItems.itemId)[0];
                                    return (
                                    <View style={[styles.list, {width:'90%', alignSelf:'center'}]} key={item.id}>
                                        <Text style={[styles.listItem, {fontSize: 18}]}> {item.item} </Text>
                                        <Text style={[styles.listPrice, {fontSize: 18}]}> $ {parseFloat(item.price).toFixed(2)} </Text>
                                    </View>
                                    );
                                })}
                        </View>
                    ))}
                    <View style={{alignItems:'center'}}>
                        <CustomButton 
                            text="+ Add Person"
                            width="75%"
                            paddingVertical={15}
                            onPress={() => this.onClickAddPerson()}
                            disabled={this.state.members[this.state.members.length-1].name == ''}
                        />
                    </View>
                </ScrollView>
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
                    width="50%"
                    onPress={()=>console.log(this.state)}
                />

                <Modal    
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showModal}
                >
                    <View style={commonStyles.fullCenterContainer}>
                        <View style={[commonStyles.fullCenterContainer, {maxHeight: '75%', width:'80%', backgroundColor:'rgba(255,255,255,0.85)'}]}>
                            <Text style={{marginVertical:10, fontSize: 20}}>Adding item for {this.state.members[this.state.curMemberId].name}</Text>
                            <ScrollView style={{width:'90%'}}>
                            {this.state.items.map(item => (
                                <TouchableHighlight
                                    activeOpacity={0.6}
                                    underlayColor="#00FF00"
                                    onPress={() => this.onSelectItem(item.id)}
                                    key={item.id}
                                >
                                    <View style={[styles.list, this.setItemColor(this.state.curMemberId, item.id)]}>
                                        <Text style={styles.listItem}> {item.item} </Text>
                                        <Text style={styles.listPrice}> $ {parseFloat(item.price).toFixed(2)} </Text>
                                    </View>
                                </TouchableHighlight>
                            ))}
                            </ScrollView>
                            <CustomButton 
                                text="Done"
                                width="50%"
                                onPress={() => this.onModalClose()}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        paddingBottom: 8
    },
    selected: {
        backgroundColor: '#00FF00'
    },
    added: {
        backgroundColor: '#FFE4B5'
    },
    listItem: {
        flex: 2,
        fontSize: 24,
        width: '100%',
        marginRight: 5
    },
    listPrice: {
        flex: 1,
        fontSize: 24,
        width: '100%',
        marginLeft: 5,
        textAlign: 'right'
    }
});