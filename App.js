// entry point of the app
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/HomeScreen';
import ManualInput from './src/ManualInput';
import SplitOption from './src/SplitOption';
import EvenSplit from './src/EvenSplit';
import ItemizedSplit from './src/ItemizedSplit';
import ResultScreen from './src/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    title: 'BillSplit',
                    headerStyle: {
                        shadowOpacity: 0.75,
                        shadowRadius: 5,
                        shadowColor: '#111',
                        shadowOffset: { height: 0, width: 0 }
                    },
                    headerTitleStyle: {
                        flex: 1,
                        textAlign: 'center',
                        color: '#222',
                        fontWeight: 'bold'
                    },
                    headerLayoutPreset: 'center',
                    headerTitleContainerStyle: {
                        left: 0
                    }
                }}>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Manual" component={ManualInput} />
                    <Stack.Screen name="SplitOption" component={SplitOption} />
                    <Stack.Screen name="EvenSplit" component={EvenSplit} />
                    <Stack.Screen name="ItemizedSplit" component={ItemizedSplit} />
                    <Stack.Screen name="ResultScreen" component={ResultScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
