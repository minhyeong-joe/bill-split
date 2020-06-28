import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import { commonStyles } from '../CommonStyles';

export default class CameraView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
        };
        // ref
        camera = null;
    }

    async componentDidMount() {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        
        console.log(cameraPermission.granted);

        const hasCameraPermission = cameraPermission.granted;
        
        console.log(hasCameraPermission);

        this.setState({ hasCameraPermission: hasCameraPermission });
        
    }

    render() {

        const { hasCameraPermission } = this.state;
        
        if (hasCameraPermission === null) {
            return <View style={[commonStyles.container, {backgroundColor: 'black'}]}/>;
        } else if (!hasCameraPermission) {
            return (
                <View style={[commonStyles.fullCenterContainer, {backgroundColor: 'black'}]}>
                    <Text style={{fontSize: 18, color: 'white'}}>Camera Access has been denied</Text>
                </View>
            );
        }

        return (
            <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
                <View style={{ flex: 5 }}></View>
                <View style={{ flex: 1, flexDirection:'row', backgroundColor:'rgba(0,0,0,0.2)', justifyContent: 'space-around', alignItems:'center', paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => {Alert.alert("Dev", "Toggle Camera Flash", [{text:"OK"}])}}>
                        <View style={{ height: 75, width: 75, borderColor: 'cyan', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{color: 'cyan', fontSize: 10}}>PLACEHOLDER</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {Alert.alert("Dev", "Take Photo!", [{text:"OK"}])}}>
                        <View style={{ height: 75, width: 75, borderColor: 'cyan', borderWidth: 2, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{color: 'cyan'}}>TEMP</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {Alert.alert("Dev", "Toggle Front/Back Camera", [{text:"OK"}])}}>
                        <View style={{ height: 75, width: 75, borderColor: 'cyan', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{color: 'cyan', fontSize: 10}}>PLACEHOLDER</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Camera>
        );

    }

}

const styles = StyleSheet.create({
    camera: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    }
});