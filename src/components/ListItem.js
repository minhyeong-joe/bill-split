import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default ListItem = (props) => {
    
    const { item, price, onClickDelete, style, itemStyle, priceStyle, wholePrice } = props;

    return (
        <View style={[styles.list, {...style}]}>
            <Text style={[styles.listItem, {...itemStyle}]}>{item}</Text>
            <Text style={[styles.listPrice, {...priceStyle}]}>
                $ {price.toFixed(2)}
                {
                  wholePrice != null && price != wholePrice? <Text style={styles.wholePrice}> ($ {wholePrice.toFixed(2)})</Text>: <></>
                }
            </Text>
            {
                typeof(onClickDelete) === typeof(Function)? 
                <TouchableOpacity style={styles.listDelete} onPress={onClickDelete}>
                    <Text style={styles.deleteIcon}>&times;</Text>
                </TouchableOpacity>
                : <></>
            }
        </View>
    );

};

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 8
    },
    listItem: {
        flex: 1,
        fontSize: 16,
        width: '100%',
        marginRight: 5,
        textAlignVertical: 'center'
    },
    listPrice: {
        flex: 1,
        fontSize: 16,
        width: '100%',
        marginLeft: 5,
        textAlign: 'right',
        textAlignVertical: 'center'
    },
    listDelete: {
        flex: 0.2,
        marginLeft: 15,
        paddingVertical: 3,
        paddingHorizontal: 5
    },
    deleteIcon: {
        fontSize: 30,
        color: 'firebrick',
        lineHeight: 28,
        fontWeight: 'bold',
        marginTop: 5
    },
    wholePrice: {
      fontStyle: 'italic',
      textDecorationLine: 'line-through'
    }
});

ListItem.propTypes = {
    item: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    onClickDelete: PropTypes.func,
    style: PropTypes.object,
    itemStyle: PropTypes.object,
    priceStyle: PropTypes.object,
    wholePrice: PropTypes.number
}