# BillSplit (temp name)

## Brief Description

This mobile app allows user to split bills including tips and tax evenly or by items.
The app allows user to have multiple configurations based on the need.

## Run Published Expo Project

**May not be the latest version in sync with the git repo**

Expo Publish Link: [https://expo.io/@sanheng03/bill-split](https://expo.io/@sanheng03/bill-split)

1. You need an Expo app on your mobile device.
2. On your device,
	- iOS
	
		open the default Apple "Camera" app and scan the QR code you see in the link above.

	- Android

		press "Scan QR Code" on the "Projects" tab of the Expo client app and scan the QR code you see in the link above.
3. Test out the app!

## Plans

- OCR API to read texts from receipt image
- Past configurations/group members local storage
- Tip adjustment (custom fee, by percentage, round up the total given minimum percentage)
- Sharing split result (by plain text with formatting, by screenshot image)
- Simple drag and drop of items to each party member

## Instruction on Running the Application

### Pre-requisite
- `expo-cli` installed on local machine
	`npm install --global expo-cli`
- Expo Client app installed on mobile machine

### Build & Run Application
- Git clone the project
- Inside the project root directory, run `expo start`
- On the mobile device, scan the QR code provided by Expo to run app
	- iOS

		open the default Apple "Camera" app and scan the QR code you see in the terminal or in Expo Dev Tools.
	- Android

		press "Scan QR Code" on the "Projects" tab of the Expo client app and scan the QR code you see in the terminal or in Expo Dev Tools.
- By default, Developer Tools like debugging log are available at http://localhost:19002
