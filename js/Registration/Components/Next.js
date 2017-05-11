import React, { Component, PropTypes } from 'react'
//import Button from 'react-native-button'
import styles from '../styles'
import { Button } from 'react-native-elements'

export default class Next extends Component {
	render() {
		return (
			<Button title={this.props.text}
					buttonStyle={{marginTop:10, backgroundColor: '#5990c3'}}
					disabled={this.props.disabled}
					onPress={this.props.onPress}
			/>
		)
	}
}

Next.propTypes = {
	disabled: PropTypes.bool,
	onPress: PropTypes.func,
	text: PropTypes.string.isRequired
}



