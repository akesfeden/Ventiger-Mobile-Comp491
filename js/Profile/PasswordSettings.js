import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput
} from 'react-native'
import { Button } from 'react-native-elements'
import styles from '../Login/styles'
import { graphql, gql, compose } from 'react-apollo'

class PasswordSettings extends Component {

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
				<TextInput
					placeholder='Old Password'
					onChangeText={(text) => this.setState({...this.state, oldPassword: text})}
					style={styles.textInput}
					autoFocus={true}
					secureTextEntry={true}
				/>

				<TextInput
					placeholder='New Password'
					onChangeText={(text) => this.setState({...this.state, newPassword: text})}
					style={styles.textInput}
					secureTextEntry={true}
				/>
				<TextInput
					placeholder='Repeat Password'
					onChangeText={(text) => this.setState({...this.state, repeatNewPassword: text})}
					style={styles.textInput}
					secureTextEntry={true}
				/>
				<Button
					title='Update'
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


