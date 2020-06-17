import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './common/CustomButton';

export default function SplitOption({ navigation, route }) {

    // [{item: abc, price: 12.3}, ...]
    items = route.params.items;
    console.log(items);

    return (
        <SafeAreaView style={styles.container}>

            <CustomButton
                text="Even Split"
                width="90%"
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