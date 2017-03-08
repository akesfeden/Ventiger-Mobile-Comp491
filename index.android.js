/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import setup from './js/setup'
import Button from 'react-native-button';

/*export default class VentigerMobile extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Button containerStyle={styles.containerStyle} style={styles.style}
                        onPress={()=>console.log("foo")}>
                    Login
                </Button>
                <Button containerStyle={styles.containerStyle} style={styles.style}onPress={()=>console.log("foo")}>
                    Something
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
});*/

AppRegistry.registerComponent('VentigerMobile', setup);
