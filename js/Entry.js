import React, { Component } from 'react';
import { View } from 'react-native';
import Button from 'react-native-button';
import VStyleSheet from './VStyleSheet'
import {Button as EButton} from 'react-native-elements'

export default class Entry extends Component {
	static navigationOptions = {
		title: "Welcome to Ventiger"
	}
	render() {
		const { navigate } = this.props.navigation
		return (
            <View style={styles.container}>
                <Button
                    containerStyle={styles.containerStyle1} style={styles.style}
                    onPress={()=>navigate('Login')}>
                    Login
                </Button>
                <Button containerStyle={styles.containerStyle2} style={styles.style} onPress={()=>navigate('PhoneRegistration')}>
                    Register
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
		//backgroundColor: '#F5FCFF'
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
	containerStyle1: {padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: '#619fc3',
		margin:15, width:250},
	containerStyle2: {padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: '#71c37c',
		margin:15, width:250},

	style: {fontSize: 20, color: '#333333'}
});