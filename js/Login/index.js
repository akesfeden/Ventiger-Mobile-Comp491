import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput
} from 'react-native'
import Button from 'react-native-button'
import styles from './styles'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NavigationActions } from 'react-navigation'

class Login extends Component {
	static navigationOptions = {
		title: "Login"
	}

	constructor(props) {
		super(props)
		this.state = {
			password: '',
			email: '',
			phone: '',
			usePhone: true,
			disabled: true
		}
		this.loginAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({routeName: 'Profile'})
			]
		})
	}

	_performLogin() {
		const body = {
			phone: this.state.phone,
			password: this.state.password
		}
		//TODO: cache token somewhere safe
		this.props.mutate({variables: {body}})
			.then(({data}) => {
				console.log(data)
				this.props.navigation.dispatch(this.loginAction)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput placeholder="Phone" onChangeText={(text) => this.setState({...this.state, phone: text})}
						   value={this.state.phone}
						   style={styles.textInput}
						   keyboardType={'phone-pad'}
				/>
				<TextInput placeholder="Password"
						   secureTextEntry={true}
						   onChangeText={(text) => {
						   		this.setState({...this.state, password: text})
						   }}
						   value={this.state.password}
						   style={styles.textInput}
				/>
				<Button containerStyle={styles.containerStyle}
						containerStyleDisabled
						style={styles.style}
						styleDisabled={styles.style}
						onPress={this._performLogin.bind(this)}>
					Login
				</Button>
			</View>
		);
	}
}



Login.propTypes = {
	mutate: PropTypes.func.isRequired
}

const loginMutation = gql`
	mutation Login($body: LoginBody!){
		login(body: $body) {
			token
		}
	}
`

const LoginWithData = graphql(loginMutation)(Login)

export default LoginWithData