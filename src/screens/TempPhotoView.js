import React from 'react';
import { View, Text, Image } from 'react-native';

import { commonStyles } from '../CommonStyles';

export default function TempPhotoView({route}) {

    console.log(route);
    
    return (
        <View style={commonStyles.container}>

            <Text style={{textAlign: 'center'}}>Image Preview</Text>
            <Text style={{textAlign: 'center'}}>Temporary Page for Camera Test</Text>

            <Image 
                source={{uri: route.params.image.uri}}
                style={{height: '100%', width:'100%', resizeMode:'contain'}}
            />

        </View>
    );
}