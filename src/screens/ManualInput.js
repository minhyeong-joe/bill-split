import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';

import { commonStyles } from '../CommonStyles';
import CustomButton from '../components/CustomButton';
import InputGroup from '../components/InputGroup';
import ListItem from '../components/ListItem';

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

    onClickItemDelete = id => {
        this.itemInput.blur();
        this.priceInput.blur();
        let items = [...this.state.items];
        items = items.filter(item => item.id != id);
        this.setState({
            items: items
        });
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

                <ScrollView style={{width: '90%', backgroundColor: '#eee'}} keyboardShouldPersistTaps="always">
                    {this.state.items.map(item => (
                        <ListItem 
                            key={item.id}
                            item={item.item}
                            price={item.price}
                            onClickDelete={() => this.onClickItemDelete(item.id)}
                        />
                    ))}
                </ScrollView>
                
                <View style={{width: '90%'}}>
                    <InputGroup 
                        style={{width:'40%', alignSelf: 'flex-end'}}
                        label="Tax:"
                        appendedText="%"
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
    }
});
