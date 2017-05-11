import React, {Component} from "react";
import {TextInput, View} from "react-native";
import {Button, FormLabel, FormInput} from "react-native-elements";
import styles from "../Login/styles";
import {gql, graphql} from "react-apollo";
const strings = require('../strings').default.passwordSettings

class PasswordSettings extends Component {

	static navigationOptions = {
		title: 'Change Password',
	}
	constructor(props) {
		super(props)
		this.state = {
			oldPassword: '',
			newPassword: '',
			repeatNewPassword: ''
		}
	}
	//_send
	_updatePassword() {
		console.log(this.state)
		this.props.mutate({variables: {
			oldPassword: this.state.oldPassword,
			newPassword: this.state.newPassword
		}}).then(res => {
			if (res.data.changePassword) {
				console.log('Success...')
			} else {
				console.log('Fail...')
			}
		}).catch(err => {
			console.error(err)
		})
	}

	render() {
		return (
			<View>
				<FormLabel>{strings.oldPasswordPlaceholder}</FormLabel>
				<FormInput
					onChangeText={(text) => this.setState({...this.state, oldPassword: text})}
					autoFocus={true}
					secureTextEntry={true}
				/>
				<FormLabel>{strings.newPasswordPlaceholder}</FormLabel>
				<FormInput
					onChangeText={(text) => this.setState({...this.state, newPassword: text})}
					secureTextEntry={true}
				/>
				<FormLabel>{strings.repeatPasswordPlaceholder}</FormLabel>
				<FormInput
					onChangeText={(text) => this.setState({...this.state, repeatNewPassword: text})}
					secureTextEntry={true}
				/>
				<Button
					title={'Change Password'}
					buttonStyle={{backgroundColor: '#ff4b48', marginTop:10}}
					onPress={this._updatePassword.bind(this)}
				/>
			</View>
		)
	}
}

const changePassword = gql`
	mutation ($oldPassword: Password!, $newPassword: Password!){
		changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
	}
`

export default graphql(changePassword)(PasswordSettings)


