import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {Container, Grid, Title, Row, Text} from 'native-base'

export default class Chat extends Component{
	static navigationOptions = {
		title: ({state}) => {
			//return 'Some Event'
			return state.params.event.title
		},
	}

	constructor(props) {
		super(props);
		this.state = {messages: []}
		this.onSend = this.onSend.bind(this)
	}
	componentWillMount() {
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
					user: {
						_id: 2,
						name: 'React Native'
					},
				},
			],
		})
	}
	onSend(messages = []) {
		this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			}
		})
	}

	_getTopic() {
		return this.props.navigation.state.params.topic
	}

	render() {
		return (
			<Container>
				<Grid>
					<Row size={1}>
						<Text>Topic: {this._getTopic()}</Text>
					</Row>
					<Row size={9}>
						<GiftedChat
							loadEarlier={true}
							messages={this.state.messages}
							onSend={this.onSend}
							user={{
					  _id: 1,
					}}
						/>
					</Row>
				</Grid>
			</Container>
		)
	}
}