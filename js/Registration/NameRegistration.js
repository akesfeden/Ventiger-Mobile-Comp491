import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput,
	Text
} from 'react-native'
import Next from './Components/Next'
import styles from './styles'
import { registerName } from '../actions/registration-actions'
import { connect } from 'react-redux'

class NameRegistration extends Component {
	static navigationOptions = {
		title: "Your Name"
	}

	_handleNameEntry(name) {
		this.props.saveName(name)
	}

	_shouldButtonBeActive() {
		return this.props.name &&
			this.props.name.length != 0
	}

	_nextScreen() {
		this.props.navigation.navigate('PasswordRegistration')
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput placeholder="Name"
						   style={styles.textInput}
						   onChangeText={this._handleNameEntry.bind(this)}
				/>
				<Next text="Next"
					  disabled={!this._shouldButtonBeActive()}
					  onPress={this._nextScreen.bind(this)} />
			</View>
		)
	}
}

export default connect(
	(state) => ({ name: state.registration.name }),
	(dispatch) => ({
		saveName (name) {
			dispatch(registerName(name))
		}
	})
)(NameRegistration)



