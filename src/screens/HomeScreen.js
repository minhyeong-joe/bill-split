import React from 'react';
import { View } from 'react-native';

import { commonStyles } from '../CommonStyles';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
    return (
        <View style={commonStyles.container}>

            <CustomButton
                text="Scan Receipt"
                width="90%"
            />

            <CustomButton
                text="Manual Input"
                width="90%"
                onPress={() => { navigation.navigate('Manual') }}
            />

        </View>
    );
}