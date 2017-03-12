import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Button from 'react-native-button'
//import { NavigationActions } from 'react-navigation'
import { logout as logoutAction } from '../actions/login-actions'
import { connect } from 'react-redux'

class Profile extends Component {
	static navigationOptions = {
		title: "Ventiger"
	}

	_logout() {
		this.props.logout()
		//this.props.navigation.dispatch(Profile.logoutAction)

	}

	render() {
		//const { navigate } = this.props.navigation
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

export default connect(
	(state) => ({ name: state.login }),
	(dispatch) => ({
		logout() {
			dispatch(logoutAction())
		}
	})
)(Profile)