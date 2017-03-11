import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput,
	Text
} from 'react-native'
import Next from './Components/Next'
import styles from './styles'
import {
	registerPassword,
	unsetPassword,
	setId
}
from '../actions/registration-actions'
import { connect } from 'react-redux'
import { gql, graphql } from 'react-apollo'

class PasswordRegistration extends Component {
	static navigationOptions = {
		title: "Password"
	}

	constructor(props) {
		super(props)
		this.state = {
			repeatPassword: ""
		}
	}

	_handlePasswordEntry(password) {
		console.log(this.props)
		this.props.onPasswordChange(password)
	}

	_handleRepeatPasswordEntry(repeatPassword) {
		this.setState({...this.state, repeatPassword})
	}

	// TODO: add business logic for password
	_shouldButtonBeActive() {
		return (this.props.password
			|| this.state.repeatPassword)
			&& (this.props.password === this.state.repeatPassword)
	}

	_renderErrorMessage() {
		if ((this.props.password
			|| this.state.repeatPassword)
			&& !(this.props.password === this.state.repeatPassword)) {
			return (
				<Text>Passwords mismatch :(</Text>
			)
		}
	}

	componentWillUnmount() {
		this.props.onBack()
	}

	_nextScreen() {
		//this.props.completeRegistration(this.props.registerBody)
		//TODO: handle mutation error
		console.log('body', this.props.registerBody)
		this.props.mutate({variables: {body: this.props.registerBody}})
			.then(res => {
				console.log(res)
				this.props.completeRegistration(res)
				this.props.navigation.navigate("CodeRegistration")
			})
			.catch(err => {
				//this.setState({})
				console.error(err)
			})
		//
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput placeholder="Password"
						   style={styles.textInput}
						   secureTextEntry={true}
						   onChangeText={this._handlePasswordEntry.bind(this)}
				/>
				<TextInput placeholder="Repeat Password"
						   secureTextEntry={true}
						   style={styles.textInput}
						   onChangeText={this._handleRepeatPasswordEntry.bind(this)}

				/>
				{this._renderErrorMessage()}
				<Next text="Next"
					  onPress={this._nextScreen.bind(this)}
					  disabled={!this._shouldButtonBeActive.bind(this)()}
				/>
			</View>
		)
	}
}

PasswordRegistration.propTypes = {
	mutate: PropTypes.func.isRequired
}

// TODO: Consider refactoring this
const registerUser = gql`
	mutation UserRegistration ($body: RegistrationBody!){
		register(body: $body)
	}
`

/*const body = {
	phone: '05059309',
	password: 'cancan',
	name: 'cancan'
}*/
const PasswordRegisterWithData = graphql(registerUser)(PasswordRegistration)


export default connect(
	(state) => ({
		password: state.registration.password,
		// TODO: Email support
		registerBody: {
			phone: state.registration.phone,
			password: state.registration.password,
			name: state.registration.name
		}
	}),
	(dispatch) => ({
		onPasswordChange(password) {
			dispatch(registerPassword(password))
		},
		onBack() {
			dispatch(unsetPassword())
		},
		completeRegistration (res) {
			dispatch(setId(res.data.register))
		}
	})
)(PasswordRegisterWithData)



