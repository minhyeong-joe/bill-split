import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import PropTypes from "prop-types";

export default ListItem = props => {
  const {
    item,
    price,
    onClickDelete,
    onClickEdit,
    style,
    itemStyle,
    priceStyle,
    wholePrice,
  } = props;

  return (
    <View style={[styles.list, { ...style }]}>
      <Text style={[styles.listItem, { ...itemStyle }]}>{item}</Text>
      <Text style={[styles.listPrice, { ...priceStyle }]}>
        $ {price.toFixed(2)}
        {wholePrice != null && price != wholePrice ? (
          <Text style={styles.wholePrice}> ($ {wholePrice.toFixed(2)})</Text>
        ) : (
          <></>
        )}
      </Text>
      {typeof onClickEdit === typeof Function ? (
        <TouchableOpacity style={styles.iconContainer} onPress={onClickEdit}>
          <FontAwesome5 name="edit" style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      {typeof onClickDelete === typeof Function ? (
        <TouchableOpacity style={styles.iconContainer} onPress={onClickDelete}>
          <FontAwesome5
            name="times"
            style={[styles.icon, { color: "firebrick" }]}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    borderBottomColor: "#999",
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  listItem: {
    flex: 1,
    fontSize: 16,
    width: "100%",
    marginRight: 5,
    textAlignVertical: "center",
  },
  listPrice: {
    flex: 1,
    fontSize: 16,
    width: "100%",
    marginLeft: 5,
    textAlign: "right",
    textAlignVertical: "center",
  },
  iconContainer: {
    flex: 0.3,
    marginHorizontal: 2,
  },
  icon: {
    textAlign: "center",
    fontSize: 25,
    color: "black",
    lineHeight: 25,
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  wholePrice: {
    fontStyle: "italic",
    textDecorationLine: "line-through",
  },
});

ListItem.propTypes = {
  item: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  onClickDelete: PropTypes.func,
  onClickEdit: PropTypes.func,
  style: PropTypes.object,
  itemStyle: PropTypes.object,
  priceStyle: PropTypes.object,
  wholePrice: PropTypes.number,
};
