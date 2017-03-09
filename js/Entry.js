import React, { Component } from 'react';
import { View } from 'react-native';
import Button from 'react-native-button';
import VStyleSheet from './VStyleSheet'

export default class Entry extends Component {
    static navigationOptions = {
        title: "Welcome"
    }
    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <Button
                        containerStyle={styles.containerStyle} style={styles.style}
                        onPress={()=>navigate('Login')}>
                    Login
                </Button>
                <Button containerStyle={styles.containerStyle} style={styles.style}
                        onPress={()=>navigate('PhoneRegistration')}>
                    Registration
                </Button>
            </View>
        );
    }
}

const styles = VStyleSheet({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    containerStyle: {padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'black',
        margin:15, width:250},

    style: {fontSize: 20, color: 'green'}
});