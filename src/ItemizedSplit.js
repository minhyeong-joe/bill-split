import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, Switch, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { commonStyles } from './common/CommonStyles';
import CustomButton from './common/CustomButton';
import InputGroup from './common/InputGroup';

export default class ItemizedSplit extends Component {
    
    constructor(props) {
        super(props);
        const { items } = this.props.route.params;
        this.state = {
            // members: [ {name: abc, items: [{item: a, price: 12}, {item: b, price: 4} ... ] } ... ]
            members: [{name: '', items: []}],
            items: items,
            tip: '15.0',
            roundUp: false,
            showModal: false,
            curId: 0,
            curSelectedItem: [],
            selectedItems: []
        };
        this.onChangeTip = this.onChangeTip.bind(this);
        this.onSwitchRoundUp = this.onSwitchRoundUp.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onClickAddPerson = this.onClickAddPerson.bind(this);
        this.onClickAddItem = this.onClickAddItem.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);

        console.log(this.state);
        
    }

    onClickAddPerson() {
        let newMember = {name: '', items: []};
        this.setState(prevState => ({
            members: [...prevState.members, newMember]
        }));
    }

    onChangeName(name, id) {
        let members = [...this.state.members];
        members[id].name = name;
        this.setState({
            members: members
        });
    }

    onClickAddItem(id) {
        this.setState({
            showModal: true,
            curId: id
        });
    }

    onSelectItem(id) {
        let selected = [...this.state.curSelectedItem];
        if (selected.includes(id)) {
            // de-select
            selected.splice(selected.indexOf(id), 1);
        }
        else {
            // select
            selected.push(id);
        }
        this.setState(prevState => ({
            curSelectedItem: selected
        }));
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

    render() {
        return (
            <SafeAreaView style={commonStyles.container}>
                <ScrollView style={{maxHeight: '80%', backgroundColor:'#eee', width: '90%', flex:1}}>
                    {this.state.members.map((member, index) => (
                        <View style={{flexDirection:'row', width:'100%'}} key={index}>
                            <TextInput
                                style={[commonStyles.input, {flex:3, lineHeight:24, fontSize: 24, marginHorizontal: 15}]}
                                placeholder="Name"
                                onChangeText={(name) => this.onChangeName(name, index)}
                                value={this.state.members[index].name}
                                underlineColorAndroid="#999"
                            />
                            <CustomButton 
                                text="Add Item"
                                width="30%"
                                style={{flex:1}}
                                paddingVertical={10}
                                backgroundColor="#7FFF00"
                                disabled={this.state.members[index].name == ''}
                                onPress={()=>this.onClickAddItem(index)}
                            />
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
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={commonStyles.fullCenterContainer}>
                        <View style={[commonStyles.fullCenterContainer, {maxHeight: '75%', width:'80%', backgroundColor:'rgba(255,255,255,0.85)'}]}>
                            <Text style={{marginVertical:10, fontSize: 20}}>Adding item for {this.state.members[this.state.curId].name}</Text>
                            <ScrollView style={{width:'90%'}}>
                            {this.state.items.map((item, index) => (
                                <TouchableHighlight
                                    activeOpacity={0.6}
                                    underlayColor="#00FF00"
                                    onPress={() => this.onSelectItem(index)}
                                    key={index}
                                >
                                    <View style={[styles.list, this.state.curSelectedItem.includes(index)? styles.selected: {}]} key={index}>
                                        <Text style={styles.listItem}> {item.item} </Text>
                                        <Text style={styles.listPrice}> $ {parseFloat(item.price).toFixed(2)} </Text>
                                    </View>
                                </TouchableHighlight>
                            ))}
                            </ScrollView>
                            <CustomButton 
                                text="Done"
                                width="50%"
                                onPress={() => this.setState({showModal:false})}
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
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