import React, { Component, PropTypes } from 'react'
import Button from 'react-native-button'
import styles from '../styles'

export default class Next extends Component {
	render() {
		return (
			<Button containerStyle={styles.containerStyle}
					containerStyleDisabled={styles.containerStyleDisabled}
					style={styles.style}
					styleDisabled={styles.style}
					disabled={this.props.disabled}
					onPress={this.props.onPress}>
				{this.props.text}
			</Button>
		)
	}
}

Next.propTypes = {
	disabled: PropTypes.bool,
	onPress: PropTypes.func,
	text: PropTypes.string.isRequired
}



