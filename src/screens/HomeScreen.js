import React from 'react';
import { View } from 'react-native';

import { commonStyles } from '../CommonStyles';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
    return (
        <View style={commonStyles.container}>

            <CustomButton
                text="Scan Receipt"
                style={{marginVertical: 20, width: '75%'}}
            />

            <CustomButton
                text="Manual Input"
                style={{marginVertical: 20, width: '75%'}}
                onPress={() => { navigation.navigate('Manual') }}
            />

        </View>
    );
}