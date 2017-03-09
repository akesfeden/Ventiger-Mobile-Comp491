import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Button from 'react-native-button'
import { NavigationActions } from 'react-navigation'

export default class Profile extends Component {
	static navigationOptions = {
		title: "Ventiger"
	}
	static logoutAction = NavigationActions.reset({
		index: 0,
		actions: [
			NavigationActions.navigate({routeName: 'Entry'})
		]
	})

	_logout() {
		this.props.navigation.dispatch(Profile.logoutAction)

	}

	render() {
		const { navigate } = this.props.navigation
		return (
			<View style={{marginTop:10}}>
				<Text>Ohey</Text>
				<Button
					onPress={this._logout.bind(this)}
					containerStyle={{backgroundColor: 'red',}}
					style={{color: 'black'}}
				>
					Logout
				</Button>
			</View>
		)
	}
}