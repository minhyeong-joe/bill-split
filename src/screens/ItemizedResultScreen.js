import React from "react";
import { Text, ScrollView, View, StyleSheet, Share } from "react-native";

import { commonStyles } from "../CommonStyles";

import CustomButton from '../components/CustomButton';

export default function ItemizedResultScreen({ navigation, route }) {

  const {
    items,
    members,
    memberItems,
    tipPercent,
    taxPercent,
    roundUp,
  } = route.params.data;

  let memberCharges = [];

  // for each member, get individual's item portion prices
  members.forEach(member => {
    // id of items that belong to this member
    let myItems = memberItems
      .filter(memberItem => memberItem.memId == member.id)
      .map(memberItem => memberItem.itemId);

    // get price of each item
    // first get count (how many people are also paying for this item)
    let counts = []; // to "cache" the count if the item has been already counted. counts = [{itemId: 0, count: 3}, ...]
    myItems.forEach(itemId => {
      let count;
      // if already counted before, use that value
      if (counts.filter(c => c.itemId == itemId).length > 0) {
        count = c.count;
      } else {
        count = memberItems.reduce((acc, memberItem) => {
          return memberItem.itemId == itemId && memberItem.memId != member.id
            ? acc + 1
            : acc;
        }, 1);
        counts.push({ itemId: itemId, count: count });
      }

      // get whole price of the item
      let item = items.filter(item => item.id == itemId)[0];
      let portionPrice = parseFloat((item.price / count).toFixed(2));
      memberCharges.push({
        memId: member.id,
        name: member.name,
        itemId: item.id,
        itemName: item.item,
        itemWholePrice: item.price,
        itemPortionPrice: portionPrice,
      });
    });
  });

  // get the final (combined) subtotal, tip, tax, and total
  let combinedSubtotal = items.reduce((subtotal, item) => {
    return subtotal + item.price;
  }, 0);
  let combinedTax = getTax(combinedSubtotal, taxPercent);
  let combinedTip;
  let newTipPercent = tipPercent;
  if (roundUp) {
    combinedTip = getTipRoundUp(
      combinedSubtotal,
      tipPercent,
      combinedTax,
      members.length
    );
    newTipPercent = getTipPercent(combinedSubtotal, combinedTip);
  } else {
    combinedTip = getTip(combinedSubtotal, tipPercent);
  }
  let combinedTotal = getTotal(combinedSubtotal, combinedTax, combinedTip);

  return (
    <View style={commonStyles.container}>
      <Text style={styles.heading}>Bill</Text>
      <ScrollView style={styles.list}>
        {members.map(member => {
          let subtotal = getSubtotal(memberCharges, member.id);
          let tax = getTax(subtotal, taxPercent);
          let tip = getTip(subtotal, newTipPercent);
          let total = getTotal(subtotal, tax, tip);

          return (
            <View key={member.id}>
              <Text style={styles.memberName}>{member.name}</Text>
              {memberCharges
                .filter(memberCharge => memberCharge.memId == member.id)
                .map(memberCharge => (
                  <ListItem
                    style={{ width: "80%", alignSelf: "center" }}
                    key={memberCharge.itemId}
                    item={memberCharge.itemName}
                    price={memberCharge.itemPortionPrice}
                    wholePrice={memberCharge.itemWholePrice}
                  />
                ))}
              <View>
                <View style={styles.row}>
                  <Text style={styles.label}>Subtotal: </Text>
                  <Text style={styles.value}>$ {subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Tax: </Text>
                  <Text style={styles.value}>
                    $ {tax.toFixed(2)} ({taxPercent.toFixed(1)} %)
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Tip: </Text>
                  <Text style={styles.value}>
                    $ {tip.toFixed(2)} ({tipPercent.toFixed(1)} %)
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: "#999",
                    borderTopWidth: 1,
                    width: "80%",
                    alignSelf: "center",
                    marginTop: 8,
                  }}
                ></View>
                <View style={[styles.row, { marginBottom: 8 }]}>
                  <Text style={[styles.label, { fontSize: 18 }]}>Total: </Text>
                  <Text style={[styles.value, { fontSize: 18 }]}>
                    $ {total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal: </Text>
          <Text style={styles.value}>$ {combinedSubtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax: </Text>
          <Text style={styles.value}>
            $ {combinedTax.toFixed(2)} ({taxPercent.toFixed(1)} %)
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tip: </Text>
          <Text style={styles.value}>
            $ {combinedTip.toFixed(2)} ({tipPercent.toFixed(1)} %)
          </Text>
        </View>
        <View
          style={[
            styles.row,
            {
              marginBottom: 8,
              borderTopWidth: 1,
              borderColor: "#999",
              marginTop: 10,
            },
          ]}
        >
          <Text style={[styles.label, { fontSize: 18 }]}>Total: </Text>
          <Text style={[styles.value, { fontSize: 18 }]}>
            $ {combinedTotal.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={[styles.row, {marginTop: 'auto', marginBottom: 30, justifyContent: 'center'}]}>
        <CustomButton 
          text="Share"
          onPress={()=>onClickShare({members, memberCharges, combinedSubtotal, combinedTax, combinedTip, combinedTotal, newTipPercent, taxPercent})}
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

// Get subtotal given member id
function getSubtotal(memberCharges, memId) {
  let subtotal = memberCharges.reduce((subtotal, memCharge) => {
    return memCharge.memId == memId
      ? subtotal + memCharge.itemPortionPrice
      : subtotal;
  }, 0);
  return subtotal;
}

// Get tax given subtotal and tax rate
function getTax(subtotal, taxRate) {
  return parseFloat((subtotal * (taxRate / 100)).toFixed(2));
}

// Get tip given subtotal and tip percent
function getTip(subtotal, tipPercent) {
  return parseFloat(((subtotal * tipPercent) / 100).toFixed(2));
}

// Get tip such that total rounds up, given subtotal, tip percent, tax, numParty
function getTipRoundUp(subtotal, tipPercent, tax, numParty) {
  let tip = parseFloat(((subtotal * tipPercent) / 100).toFixed(2));
  let total = parseFloat((subtotal + tax + tip).toFixed(2));
  let newTotal = divisibleByN(total, numParty);
  return parseFloat((tip + newTotal - total).toFixed(2));
}

// Get new tip percent after round up
function getTipPercent(subtotal, tip) {
  return parseFloat(((tip / subtotal) * 100).toFixed(1));
}

// Get total given subtotal, tax, and tip
function getTotal(subtotal, tax, tip) {
  return parseFloat((subtotal + tax + tip).toFixed(2));
}

function divisibleByN(price, n) {
  let quotient = price / n;
  let roundedQuotient = Math.ceil(quotient);
  return roundedQuotient * n;
}

const onClickShare = (data) => {
  const { members, memberCharges, combinedSubtotal, combinedTax, combinedTip, combinedTotal, newTipPercent:tipPercent, taxPercent } = data;
  let text = "";
  members.forEach(member => {
    text += "Name: " + member.name + "\n";
    memberCharges.filter(memCharge => memCharge.memId == member.id).forEach(memCharge => {
      text += memCharge.itemName.substring(0, 15).padEnd(30, " ") + "$ " + memCharge.itemPortionPrice.toFixed(2) + "\n";
    });
    text += "\n".padStart(42, "-");
    let subtotal = getSubtotal(memberCharges, member.id);
    let tax = getTax(subtotal, taxPercent);
    let tip = getTip(subtotal, tipPercent);
    text += "Subtotal:".padEnd(30, " ") + "$ " + subtotal.toFixed(2) + "\n";
    text += "Tax:".padEnd(30, " ") + "$ " + tax.toFixed(2) + "\n";
    text += "Tip:".padEnd(30, " ") + "$ " + tip.toFixed(2) + "\n";
    text += "Total:".padEnd(30, " ") + "$ " + getTotal(subtotal, tax, tip).toFixed(2) + "\n";
    text += "\n".padStart(42, "=");
  });
  text += "Subtotal:".padEnd(30, " ") + "$ " + combinedSubtotal.toFixed(2) + "\n";
  text += "Tax:".padEnd(30, " ") + "$ " + combinedTax.toFixed(2) + "\n";
  text += "Tip:".padEnd(30, " ") + "$ " + combinedTip.toFixed(2) + "\n";
  text += "Total:".padEnd(30, " ") + "$ " + combinedTotal.toFixed(2) + "\n";

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
    backgroundColor: "#ddd",
    marginVertical: 10,
    maxHeight: "60%",
    width: "90%",
    paddingTop: 5,
  },
  memberName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#9cc287",
    width: "80%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    width: "90%",
  },
  label: {
    flex: 1.5,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
  },
});
