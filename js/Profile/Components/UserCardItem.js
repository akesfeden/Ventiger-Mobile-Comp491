import React, { Component, PropTypes } from 'react'
import { Image } from 'react-native'
import {Col, CardItem, Button, Text, Grid} from 'native-base'

export default class UserCardItem extends Component {
	static contentSize=8
	_renderButtons() {
		if (this.props.renderButtons) {
			return this.props.renderButtons()
		}
		return <Text></Text>
	}

	render() {
		console.log('Card Item Key', this.props.key)
		return (
			<CardItem key={this.props.key} onPress={this.props.onPress}>
				<Grid>
					<Col size={3}>
						<Image
							//source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
							source={{uri: this.props.imageURL}}
							style={{"width":50, "height":50, marginTop: 0,
											borderRadius: 25, alignSelf: 'center'}}
						/>

					</Col>
					<Col size={5} style={{alignSelf: 'center'}}>
						{this.props.renderContent()}
					</Col>
					{this._renderButtons()}
				</Grid>
			</CardItem>
		)
	}
}

UserCardItem.propTypes = {
	renderContent: PropTypes.func.isRequired,
	renderButtons: PropTypes.func,
	onPress: PropTypes.func,
	imageURL: PropTypes.string,
	key: PropTypes.number
}