// entry point of the app
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/HomeScreen';

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
                        textAlign: 'center',
                        color: '#222',
                        fontWeight: 'bold'
                    }
                }}>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
