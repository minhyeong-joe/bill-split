import React from 'react';
import { Text, ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen({navigation, route}) {

  const { items, numParty, roundUp, subtotal, tax, taxPercent, tip, tipPercent, total } = route.params.result;

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={[styles.label, {fontSize: 18, fontWeight: 'bold'}]}>Sub-total: </Text>
        <Text style={[styles.value, {fontSize: 18, fontWeight: 'bold'}]}> $ {subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tax: </Text>
        <Text style={styles.value}> $ {tax.toFixed(2)} ({taxPercent.toFixed(1)} %)</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tip: </Text>
        <Text style={styles.value}> $ {tip.toFixed(2)} ({tipPercent.toFixed(1)} %)</Text>
      </View>
      <View style={[styles.row, {borderTopWidth: 1, borderTopColor: '#222', marginTop: 5}]}>
        <Text style={[styles.label, {fontSize: 18, fontWeight: 'bold'}]}>Total: </Text>
        <Text style={[styles.value, {fontSize: 18, fontWeight: 'bold'}]}> $ {total.toFixed(2)} </Text>
      </View>
      <Text style={styles.perPerson}> $ {(total/numParty).toFixed(2)} / Person</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    width: '75%',
    textAlign: 'center'
  },
  list: {
    backgroundColor: '#eee',
    marginVertical: 10,
    maxHeight: '50%',
    width: '90%'
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 2,
    width: '80%',
    alignSelf: 'center',
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderRadius: 1
  },
  item: {
    flex: 1,
    fontSize: 20
  },
  price: {
    flex: 1,
    textAlign: 'right',
    fontSize: 20
  },
  row: {
    flexDirection: 'row',
    width: '90%'
  },
  label: {
    flex: 2,
    textAlign: 'right',
    fontSize: 16
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16
  },
  perPerson: {
    width: '90%',
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10
  }
});
