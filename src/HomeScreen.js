import React from 'react';
import { Text, TouchableNativeFeedback, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableNativeFeedback
                onPress={() => { navigation.navigate('Manual') }}
                background={TouchableNativeFeedback.SelectableBackground()}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Manual Input</Text>
                </View>

            </TouchableNativeFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: '90%',
        paddingVertical: 20,
        backgroundColor: '#87CEEB',
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    }
});