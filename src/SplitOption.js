import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './common/CustomButton';

export default function SplitOption({ navigation, route }) {
  
    const { items, taxPercent } = route.params;

    console.log(items);
    console.log(taxPercent);

    return (
        <SafeAreaView style={styles.container}>

            <CustomButton
                text="Even Split"
                width="90%"
                onPress={() => {navigation.navigate('EvenSplit', {
                  items: items,
                  taxPercent: taxPercent
                })}}
            />

            <Text style={{ textAlign:'center' }}>OR</Text>

            <CustomButton
                text="Itemized Split"
                width="90%"
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
