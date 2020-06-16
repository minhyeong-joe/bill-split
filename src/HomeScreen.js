import React from 'react';
import {  StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './common/CustomButton';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>

            <CustomButton
                text="Scan Receipt"
                width="90%"
            />

            <CustomButton
                text="Manual Input"
                width="90%"
                onPress={() => { navigation.navigate('Manual') }}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});