import React, {Component} from "react";
import {View} from "react-native";
//import Button from 'react-native-button'
//import { NavigationActions } from 'react-navigation'
import {logout as logoutAction} from "../actions/login-actions";
import {connect} from "react-redux";
import {withApollo} from "react-apollo";
//import { Button, Container, Text, Content, Icon } from 'native-base'
import {Button, List, ListItem} from "react-native-elements";
const strings = require('../strings').default.settings

class Settings extends Component {
	static navigationOptions = {
        title: strings.title
	}

	constructor(props) {
		super(props)
		//console.log(Icons)
		this.state = {
			name: "",
			oldPassword: "",
			newPassword: ""
		}
	}

	_logout() {
		this.props.logout()
		this.props.reset()
	}

	render() {
		return (
			<View>
				<List>
					<ListItem
						title={strings.editPersonalInfo}
						leftIcon={{name: 'info'}}
						onPress={
							() => this.props.navigation.navigate('NameSettings')}
					/>
					<ListItem
						title={strings.changePassword}
						leftIcon={{name: 'fingerprint'}}
						onPress={
							() => this.props.navigation.navigate('PasswordSettings')
						}
					/>
				</List>
				<Button
					title={strings.logout}
					iconRight
					onPress={this._logout.bind(this)}
					buttonStyle={{backgroundColor: '#ff4b48', marginTop:10}}
					//icon={{name: 'delete'}}
				/>
			</View>
		)
	}
}



const SettingsWithData = connect(
	(state) => ({ name: state.login }),
	(dispatch) => ({
		logout() {
			dispatch(logoutAction())
		},
		reset() {
			//dispatch({type: 'APOLLO_STORE_RESET'})
		}
	})
)(Settings)

export default withApollo(SettingsWithData)

