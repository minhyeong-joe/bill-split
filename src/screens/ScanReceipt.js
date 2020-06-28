import React, { Component } from 'react';
import { View } from 'react-native';

import CameraView from '../components/CameraView';

export default class ScanReceipt extends Component {
    render() {
        return (
            <CameraView />
        );
    }
}