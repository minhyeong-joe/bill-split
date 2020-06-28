// entry point of the app
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import ScanReceipt from './src/screens/ScanReceipt';
import ManualInput from './src/screens/ManualInput';
import SplitOption from './src/screens/SplitOption';
import EvenSplit from './src/screens/EvenSplit';
import ItemizedSplit from './src/screens/ItemizedSplit';
import EvenResultScreen from './src/screens/EvenResultScreen';
import ItemizedResultScreen from './src/screens/ItemizedResultScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                <NavigationContainer>
                    <Stack.Navigator 
                        screenOptions={{
                            title: 'BillSplit',
                            headerTitleStyle: {
                                textAlign: 'center',
                                color: '#222',
                                fontWeight: 'bold',
                            },
                            headerLayoutPreset: 'center',
                            headerTitleContainerStyle: {
                                left: 50,
                                right: 50,
                            },
                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    }}>
                        <Stack.Screen name="Home" component={HomeScreen}/>
                        <Stack.Screen name="Scan" component={ScanReceipt}/>
                        <Stack.Screen name="Manual" component={ManualInput} />
                        <Stack.Screen name="SplitOption" component={SplitOption} />
                        <Stack.Screen name="EvenSplit" component={EvenSplit} />
                        <Stack.Screen name="ItemizedSplit" component={ItemizedSplit} />
                        <Stack.Screen name="EvenResultScreen" component={EvenResultScreen} />
                        <Stack.Screen name="ItemizedResultScreen" component={ItemizedResultScreen} /> 
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
