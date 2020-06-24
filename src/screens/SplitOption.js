import React from 'react';
import { View, Text } from 'react-native';

import { commonStyles } from '../CommonStyles';
import CustomButton from '../components/CustomButton';

export default function SplitOption({ navigation, route }) {
  
    const { items, taxPercent } = route.params;

    return (
        <View style={commonStyles.fullCenterContainer}>

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
                onPress={() => {navigation.navigate('ItemizedSplit', {
                    items: items,
                    taxPercent: taxPercent
                })}}
            />

        </View>
    );
}