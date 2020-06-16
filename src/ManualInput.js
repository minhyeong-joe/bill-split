import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class ManualInput extends Component {

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text>This is Manual Input Screen</Text>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});