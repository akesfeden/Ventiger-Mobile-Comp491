import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput,
	Text
} from 'react-native'
//import Button from 'react-native-button'
import styles from './styles'
import { gql, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import token from '../token'
import { loginCheck } from '../actions/login-actions'
import { NavigationActions } from 'react-navigation'
import NextButton from './Components/Next'
const strings = require('../strings').default.registration


class CodeRegistration extends Component {
	static navigationOptions = {
		title: strings.codeTitle

	}

	constructor(props) {
		super(props)
		this.state = {
			code: "",
			error: "",
			disabled: true
		}
		/*this.completeAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({routeName: 'Profile'})
			]
		})*/
	}

	_handleTextChange(code) {
		this.setState({...this.state, code})
		if (code.length >= 1) {
			this.setState({...this.state, disabled: false, code: code})
		}
		//console.log(this.props)
	}

	_shouldDisabled() {
		return this.state.disabled
	}

	// TODO: Specialized error text
	_renderErrorText() {
		if(this.state.error) {
			return (
				<Text>Error...</Text>
			)
		}
	}

	_complete() {
		console.log("Code", this.state.code)

		this.props.mutate({variables: {
			_id: this.props._id,
			code: this.state.code
		}})
			.then(async (res) => {
				console.log(res)
				await token().saveToken(res.data.sendValidationCode.token)
				this.props.completeRegistration(res)
				/*this.props.navigation.dispatch(
					this.completeAction
				)*/
			})
			.catch(err => {
				console.error(err)
			})
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput placeholder={strings.codeEntry}
						   style={styles.textInput}
						   onChangeText={this._handleTextChange.bind(this)}
						   autoFocus={true}
						   autoCapitalize={false}
				/>
				{ this._renderErrorText.bind(this)() }
				<NextButton text={strings.complete}
							disabled={this._shouldDisabled.bind(this)()}
							onPress={this._complete.bind(this)}/>
			</View>
		)
	}
}

const sendCode = gql`
	mutation  Validate($code: String!, $_id: ID!){
		sendValidationCode(code:$code, _id:$_id){
			token
			daysToExpiry
		}
	}
`

const CodeRegistrationWithData = graphql(sendCode)(CodeRegistration)

export default connect(
	(state) => ({ _id: state.registration._id }),
	(dispatch) => ({
		completeRegistration () {
			// const authInfo = res.data.sendValidationCode
			dispatch(loginCheck())
		}
	})
)(CodeRegistrationWithData)