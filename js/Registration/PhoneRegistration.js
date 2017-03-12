import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput,
	Text
} from 'react-native'
import styles from './styles'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux'
import {
	registerPhone,
	removeRegistration
} from '../actions/registration-actions'
import Next from './Components/Next'
import globalStrings from '../strings'
const strings = globalStrings.registration
////import { NavigationActions } from 'react-navigation'

// TODO: Clean up code
class PhoneRegistration extends Component {
	static navigationOptions = {
		title: strings.title
	}

	constructor(props) {
		super(props)
		// console.log(props)
		// TODO: cleanup the state?
		this.state = {
			phone: "",
			buttonPressed: false,
			editable: true,
			waitingForRedux: false,
			shouldNavigate: false
		}
		this._shouldDisabled.bind(this)
	}

	_renderErrorText() {
		// console.log(this.props.data)
		/*if ((this.props.phone !== this.state.phone)
			&& this.state.buttonPressed) {
			return (
				<Text>Loading...</Text>
			)
		}*/
		if (this.state.waitingForRedux) {
			return (
				<Text>{strings.phoneLoadingMessage}</Text>
			)
		}
		if (this.props.data && (this.props.data.phoneValid == false)) {
			return (
				<Text>{strings.errorMismatch}</Text>
			)
		}
	}

	_handlePhoneChange(phone) {
		this.setState({...this.state, phone, buttonPressed: false})
		//this.props.onPhoneChange(phone)
	}

	_shouldDisabled() {
		return !Boolean(this.state.phone)
	}

	componentWillUnmount() {
		this.props.onCancel()
	}

	_next() {
		this.setState({...this.state, buttonPressed: true})
		this.props.onPhoneChange(this.state.phone)
		//console.log(this.props.data)
		//console.log(this.props.phone)
		//console.log('entered')
		this.setState({...this.state, editable: false, waitingForRedux: true})
		setTimeout(() => {
			if ((this.props.phone !== this.state.phone)) {
				//console.log('Justin is not ready')
				return
			}
			if (this.props.phone && this.props.data.phoneValid && !this.props.data.loading) {
				this.props.navigation.navigate('NameRegistration')
				//console.log('out')
			} /*else {
				//console.log('notout')
			}*/
			this.setState({...this.state, editable: true, waitingForRedux: false})
		}, 500)
	}

	render() {
		// console.log(this.props.onPhoneChange)

		return (
			<View style={styles.container}>
				<TextInput placeholder={strings.phone}
						   style={styles.textInput}
						   keyboardType={'phone-pad'}
						   onChangeText={this._handlePhoneChange.bind(this)}
						   editable={this.state.editable}
						   autoFocus={true}
				/>
				{ this._renderErrorText.bind(this)() }
				<Next text={strings.next}
					  onPress={this._next.bind(this)}
					  disabled={this._shouldDisabled.bind(this)()}
				/>
			</View>
		)
	}
}


PhoneRegistration.propTypes = {
	data: PropTypes.shape({
		loading: PropTypes.bool,
		phoneValid: PropTypes.bool
	})
}

const phoneCheck = gql`
	query phoneCheck($phone: String!){
		phoneValid(phone: $phone)
	}
`

const PhoneWithData = graphql(phoneCheck, {
	options: ({phone}) => {
		//console.log('phone', phone)
		return {
			variables: {phone: (phone ? phone : "")}
		}
	}
})(PhoneRegistration)

export default connect(
	(state) => ({ phone: state.registration.phone }),
	(dispatch) => ({
		onPhoneChange(phone) {
			dispatch(registerPhone(phone))
		},
		onCancel() {
			dispatch(removeRegistration())
		}
	})
)(PhoneWithData)