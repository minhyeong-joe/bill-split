import React from "react";
import { Text, ScrollView, View, StyleSheet, Share } from "react-native";

import { commonStyles } from "../CommonStyles";

import CustomButton from "../components/CustomButton";

export default function EvenResultScreen({ navigation, route }) {
  const {
    items,
    numParty,
    taxPercent,
    tipPercent,
    roundUp,
  } = route.params.data;
  let subtotal = 0;
  let tip = 0;
  let tax = 0;
  let total = 0;
  let newTipPercent = tipPercent;

  items.forEach(item => {
    subtotal += item.price;
  });
  subtotal = parseFloat(subtotal.toFixed(2));
  // pre-tax tip
  tip = parseFloat(((subtotal * newTipPercent) / 100).toFixed(2));
  // add tax and tip
  tax = parseFloat(((subtotal * taxPercent) / 100).toFixed(2));
  total = parseFloat((subtotal + tax + tip).toFixed(2));
  // round up?
  if (roundUp) {
    let oldTotal = total;
    total = divisibleByN(total, numParty);
    tip = parseFloat((tip + total - oldTotal).toFixed(2));
    newTipPercent = parseFloat(((tip / subtotal) * 100).toFixed(1));
  }

  return (
    <View style={commonStyles.container}>
      <Text style={styles.heading}>Bill</Text>
      <ScrollView style={styles.list}>
        {items.map((item, index) => (
          <View style={styles.listItem} key={index}>
            <Text style={styles.item}> {item.item} </Text>
            <Text style={styles.price}> $ {item.price.toFixed(2)} </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.row}>
        <Text style={[styles.label, { fontSize: 18, fontWeight: "bold" }]}>
          Sub-total:{" "}
        </Text>
        <Text style={[styles.value, { fontSize: 18, fontWeight: "bold" }]}>
          {" "}
          $ {subtotal.toFixed(2)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tax: </Text>
        <Text style={styles.value}>
          {" "}
          $ {tax.toFixed(2)} ({taxPercent.toFixed(1)} %)
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tip: </Text>
        <Text style={styles.value}>
          {" "}
          $ {tip.toFixed(2)} ({newTipPercent.toFixed(1)} %)
        </Text>
      </View>
      <View
        style={[
          styles.row,
          { borderTopWidth: 1, borderTopColor: "#999", marginTop: 8 },
        ]}
      >
        <Text style={[styles.label, { fontSize: 18, fontWeight: "bold" }]}>
          Total:{" "}
        </Text>
        <Text style={[styles.value, { fontSize: 18, fontWeight: "bold" }]}>
          {" "}
          $ {total.toFixed(2)}{" "}
        </Text>
      </View>
      <Text style={styles.perPerson}>
        {" "}
        $ {(total / numParty).toFixed(2)} / Person
      </Text>

      <View style={[styles.row, {marginTop: 'auto', marginBottom: 30, justifyContent: 'center'}]}>
        <CustomButton 
          text="Share"
          onPress={()=>onClickShare({items, subtotal, tax, tip, total, numParty})}
          btnStyle={{width: '70%', alignSelf: 'center'}}
          style={{flex:1}}
        />
        <CustomButton 
          text="Exit"
          onPress={()=>onClickExit(navigation)}
          btnStyle={{width: '70%', alignSelf: 'center', backgroundColor: '#acacac'}}
          style={{flex:1}}
        />
      </View>
    </View>
  );
}

function divisibleByN(price, n) {
  let quotient = price / n;
  let roundedQuotient = Math.ceil(quotient);
  return roundedQuotient * n;
}

const onClickShare = (data) => {
  const {items, subtotal, tax, tip, total, numParty} = data;
  let text = "";
  
  text += "Items:\n"
  items.forEach(item => {
    text += item.item.substring(0, 15).padEnd(30, " ") + "$ " + item.price.toFixed(2) + "\n";
  });
  text += "\n".padStart(42, "=");
  text += "Subtotal:".padEnd(30, " ") + "$ " + subtotal.toFixed(2) + "\n";
  text += "Tax:".padEnd(30, " ") + "$ " + tax.toFixed(2) + "\n";
  text += "Tip:".padEnd(30, " ") + "$ " + tip.toFixed(2) + "\n";
  text += "Total:".padEnd(30, " ") + "$ " + total.toFixed(2) + "\n";
  text += ("$" + (total/numParty).toFixed(2) + " / Person").padStart(26, " ") + "\n";

  console.log(text);

  Share.share({
    message: text
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));
}

const onClickExit = (navigation) => {
  navigation.popToTop();
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomColor: "#222",
    borderBottomWidth: 1,
    width: "75%",
    textAlign: "center",
  },
  list: {
    backgroundColor: "#eee",
    marginVertical: 10,
    maxHeight: "50%",
    width: "90%",
  },
  listItem: {
    flexDirection: "row",
    marginVertical: 2,
    width: "80%",
    alignSelf: "center",
    borderBottomColor: "#999",
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderRadius: 1,
  },
  item: {
    flex: 1,
    fontSize: 20,
  },
  price: {
    flex: 1,
    textAlign: "right",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    width: "90%",
  },
  label: {
    flex: 1.5,
    textAlign: "right",
    fontSize: 16,
  },
  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
  },
  perPerson: {
    width: "90%",
    textAlign: "right",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
