import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput,
	Text
} from 'react-native'
import Navigator from './Navigator'
import ProfileNavigator from './ProfileNavigator'
import { connect } from 'react-redux'
import { loginCheck } from './actions/login-actions'

class MainScreen extends Component {

	componentWillMount() {
		this.props.checkLogin()
	}

	render() {
		if (this.props.loggedIn === undefined) {
			return null
		}
		if (this.props.loggedIn) {

			// console.log('here')
			return (
				<ProfileNavigator/>
			)
		}
		//this.props.resetClient()
		return (
			<Navigator/>
		)
	}
}
				

export default connect(
	(state) => ({ loggedIn: state.login.isLoggedIn }),
	(dispatch) => ({
		checkLogin() {
			dispatch(loginCheck())
		}
	})
)(MainScreen)



