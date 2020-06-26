import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';

import { commonStyles } from '../CommonStyles';
import CustomButton from '../components/CustomButton';
import InputGroup from '../components/InputGroup';

export default class ManualInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // [{id, item, price}, ...]
            items: [],
            curIndex: 0,
            curItem: '',
            curPrice: '',
            taxPercent: '8.0'
        };
    }

    onChangeItem = item => {
        this.setState({
            curItem: item
        });
    }

    onChangePrice = price => {
        this.setState({
            curPrice: price
        });
    }

    onClickAdd = () => {
        this.setState(prevState => ({
            items: [...prevState.items, { "id": prevState.curIndex, "item": this.state.curItem, "price": parseFloat(parseFloat(this.state.curPrice).toFixed(2)) }],
            curItem: '',
            curPrice: '',
            curIndex: prevState.curIndex + 1,
        }));
        this.itemInput.focus();
    }

    onChangeTax = tax => {
        this.setState({
            taxPercent: tax
        });
    }

    onClickNext = () => {
        if (this.state.items.length == 0) {
            Alert.alert("Incomplete", "You have not added any items", [{text:"OK"}]);
        } else if (this.state.taxPercent == '' || isNaN(parseFloat(this.state.taxPercent))) {
            Alert.alert("Incomplete", "You have to fill in Tax Percentage as valid number", [{text:"OK"}]);
        } else {
            this.props.navigation.navigate('SplitOption', {
                items: this.state.items,
                taxPercent: this.state.taxPercent
            });
        }
    }

    render() {
        return (
            <View style={commonStyles.container}>
                <Text style={styles.heading}>Manual Input</Text>
                <Text style={styles.subheading}>Please enter items purchased below</Text>
                <View style={{flexDirection:'row', width: '90%', marginTop: 10, marginBottom: 0}}>
                    <TextInput
                        ref={(input) => { this.itemInput = input;}}
                        style={[commonStyles.input, {flex: 3}]}
                        placeholder="Item Name"
                        value={this.state.curItem}
                        onChangeText={item => { this.onChangeItem(item) }}
                        underlineColorAndroid="#222"
                        returnKeyType={this.state.curPrice == ''? "next": "done"}
                        onSubmitEditing={() => {this.state.curPrice == ''? this.priceInput.focus() : this.onClickAdd()}}
                        blurOnSubmit={false}
                    />
                    <TextInput
                        ref={(input) => { this.priceInput = input; }}
                        style={[commonStyles.input, {flex: 1}]}
                        placeholder="Price"
                        value={this.state.curPrice}
                        onChangeText={price => { this.onChangePrice(price) }}
                        keyboardType="numeric"
                        underlineColorAndroid="#222"
                        returnKeyType={this.state.curItem == ''? "previous": "done"}
                        onSubmitEditing={() => {this.state.curItem == ''? this.itemInput.focus() : this.onClickAdd()}}
                        blurOnSubmit={false}
                    />
                </View>
                <CustomButton
                    text="ADD"
                    onPress={this.onClickAdd}
                    disabled={this.state.curItem === '' || this.state.curPrice === ''}
                    style={{width:'50%'}}
                    btnStyle={{paddingVertical: 10}}
                />

                <ScrollView style={{width: '90%', backgroundColor: '#eee'}}>
                    {this.state.items.map((item, index) => (
                        <View style={styles.list} key={index}>
                            <Text style={styles.listItem}> {item.item} </Text>
                            <Text style={styles.listPrice}> $ {parseFloat(item.price).toFixed(2)} </Text>
                        </View>
                    ))}
                </ScrollView>
                
                <View style={{width: '90%'}}>
                    <InputGroup 
                        style={{width:'40%', alignSelf: 'flex-end'}}
                        label="Tax:"
                        append="%"
                        onChangeText={tax=>this.onChangeTax(tax)}
                        value={this.state.taxPercent}
                        placeholder="Tax Percentage"
                        keyboardType="numeric"
                    />
                </View>
                    
                <CustomButton
                    text="Next >>"
                    onPress={this.onClickNext}
                    style={{width:'100%'}}
                    btnStyle={{backgroundColor:'#08f26e', color:'#fff', borderRadius: 0}}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    heading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    subheading: {
        textAlign: 'center',
        color: '#888',
        fontSize: 12
    },
    list: {
        flexDirection: 'row',
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 8
    },
    listItem: {
        flex: 3,
        fontSize: 16,
        width: '100%',
        marginRight: 5
    },
    listPrice: {
        flex: 1,
        fontSize: 16,
        width: '100%',
        marginLeft: 5,
        textAlign: 'right'
    }
});
