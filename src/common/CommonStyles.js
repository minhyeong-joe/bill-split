import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    fullCenterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        paddingBottom: 8,
        paddingHorizontal: 8
    }
});

export { commonStyles };