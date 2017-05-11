import React, {Component} from "react"
import { View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import {Button, FormInput, FormLabel, Text} from "react-native-elements"

export default class CreateChat extends Component {
	static navigationOptions = {
		title: 'New Chat Topic'
	}

	constructor(props) {
		super(props)
		this.dispatcher = this.props.navigation.state.params.dispatcher
		this.eventId = this.props.navigation.state.params.event._id
		this.state = {}
	}

	render() {
		return (
			<View>
				<FormLabel>Topic Name</FormLabel>
				<FormInput onChangeText={text => this.setState({...this.state, description: text})}/>
				<Button
					buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#0d98c3'}}
					title='Done'
					onPress={async () => {
						const success = await this.dispatcher.newChat(this.eventId, this.state.description)
						if (success) {
							this.props.navigation.dispatch(NavigationActions.back())
						}
					}}
					disabled={!Boolean(this.state.description)}
				/>
			</View>
		)
	}
}