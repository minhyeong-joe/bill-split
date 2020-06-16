import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './common/CustomButton';

export default class ManualInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // [{item, price}, ...]
            items: [],
            curIndex: 0,
            curItem: '',
            curPrice: '',
            tax: 8.0
        };
        this.onChangeItem = this.onChangeItem.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
    }

    onChangeItem(item) {
        this.setState({
            curItem: item
        });
    }

    onChangePrice(price) {
        this.setState({
            curPrice: price
        });
    }

    onClickAdd() {
        this.setState(prevState => ({
            items: [...prevState.items, { "item": this.state.curItem, "price": this.state.curPrice }],
            curItem: '',
            curPrice: '',
            curIndex: this.state.curIndex + 1,
        }));
    }

    onChangeTax(tax) {
        this.setState({
            tax: tax
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.heading}>Manual Input</Text>
                <Text style={styles.subheading}>Please enter items purchased below</Text>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.itemInput}
                        placeholder="Item"
                        value={this.state.curItem}
                        onChangeText={text => { this.onChangeItem(text) }}
                    />
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Price"
                        value={this.state.curPrice}
                        onChangeText={text => { this.onChangePrice(text) }}
                        keyboardType="numeric"
                    />
                </View>
                <CustomButton
                    text="ADD"
                    width="50%"
                    onPress={this.onClickAdd}
                    disabled={this.state.curItem === '' || this.state.curPrice === ''}
                    paddingVertical={10}
                />

                <ScrollView style={{width: '90%'}}>
                    {this.state.items.map((item, index) => (
                        <View style={styles.list} key={index}>
                            <Text style={styles.listItem}> {item.item} </Text>
                            <Text style={styles.listPrice}> $ {parseFloat(item.price).toFixed(2)} </Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.taxContainer}>
                    <Text style={styles.taxText}>Tax: </Text>
                    <TextInput
                        style={styles.taxInput}
                        placeholder="Tax"
                        value={this.state.tax.toString()}
                        onChangeText={text => { this.onChangeTax(text) }}
                        keyboardType="numeric"
                    />
                    <Text style={styles.taxText}> % </Text>
                </View>

                <CustomButton
                    text="Next >>"
                    width="50%"
                    backgroundColor="#08f26e"
                    color="#fff"
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
    inputGroup: {
        flexDirection: 'row',
        width: '90%',
        marginVertical: 20
    },
    itemInput: {
        flex: 3,
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginRight: 5
    },
    priceInput: {
        flex: 1,
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginLeft: 5
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
    },
    taxContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '30%',
        marginLeft: 'auto',
        marginRight: 10
    },
    taxInput: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        flex: 1.5,
        marginHorizontal: 2
    },
    taxText: {
        lineHeight: 18,
        fontSize: 18,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});