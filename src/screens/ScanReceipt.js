import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";

import { commonStyles } from "../CommonStyles";

export default class ScanReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      flashMode: Camera.Constants.FlashMode.off,
      type: Camera.Constants.Type.back,
    };
    // ref
    camera = null;
  }

  async componentDidMount() {
    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);

    const hasCameraPermission = cameraPermission.granted;

    this.setState({ hasCameraPermission: hasCameraPermission });
  }

  onClickFlash = () => {
    this.setState(prevState => ({
      flashMode:
        prevState.flashMode == Camera.Constants.FlashMode.on
          ? Camera.Constants.FlashMode.off
          : Camera.Constants.FlashMode.on,
    }));
  };

  onClickPhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 0.5,
      });
      this.props.navigation.navigate("VerifyScan", {
        image: photo,
      });
      // FOR DEBUG AND TEST WITHOUT USING API
      // this.props.navigation.navigate("VerifyScan");
    }
  };

  onClickReverse = () => {
    this.setState(prevState => ({
      type:
        prevState.type == Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    }));
  };

  render() {
    const { hasCameraPermission, flashMode, type } = this.state;

    if (hasCameraPermission === null) {
      return (
        <View style={[commonStyles.container, { backgroundColor: "black" }]} />
      );
    } else if (!hasCameraPermission) {
      return (
        <View
          style={[
            commonStyles.fullCenterContainer,
            { backgroundColor: "black" },
          ]}
        >
          <Text style={{ fontSize: 18, color: "white" }}>
            Camera Access has been denied
          </Text>
        </View>
      );
    }

    return (
      <Camera
        style={{ flex: 1 }}
        flashMode={flashMode}
        type={type}
        autoFocus={Camera.Constants.AutoFocus.on}
        ref={camera => (this.camera = camera)}
      >
        <View style={{ flex: 5 }}></View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "space-around",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={this.onClickFlash}>
            <View
              style={{
                height: 50,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={
                  flashMode == Camera.Constants.FlashMode.on
                    ? "md-flash"
                    : "md-flash-off"
                }
                size={32}
                color="white"
              ></Ionicons>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onClickPhoto}>
            <View
              style={{
                height: 75,
                width: 75,
                borderColor: "white",
                borderWidth: 3,
                borderRadius: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="md-camera" size={46} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onClickReverse}>
            <View
              style={{
                height: 50,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="md-reverse-camera" size={32} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    height: "100%",
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
