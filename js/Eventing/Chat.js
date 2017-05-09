import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { Picker } from 'react-native'
import { Container, Grid, Row, Text } from 'native-base'
import { connect } from 'react-redux'

class Chat extends Component{
	static navigationOptions = {
		title: ({state}) => {
			//return 'Some Event'
			return state.params.title
		},
	}

	constructor(props) {
		super(props);
		this.state = {messages: [], pickingTopic: false, chatId: this.props.navigation.state.params.chatId}
		this.onSend = this.onSend.bind(this)
		this.dispatcher = this.props.navigation.state.params.dispatcher
	}
	componentWillMount() {
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
					user: {
						_id: 1,
						name: 'React Native'
					},
				},
			],
		})
	}

	onSend(messages = []) {
		console.log('Messages ', messages)
		this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			}
		})
	}

	_setupChats() {
		const chat = this._getChat()
		if (chat.messages) {
			this.setState({

			})
		}
	}

	_getChats() {
		const { eventId } = this.props.navigation.state.params
		console.log('Event id ', eventId)
		return this.props.chats[eventId]
	}

	_getChat() {
		const { eventId } = this.props.navigation.state.params
		const chatId = this.state.chatId
		return this.props.chats[eventId][chatId]
	}

	_getEvent() {
		const { eventId } = this.props.navigation.state.params
		return this.props.events[eventId]
	}

	_renderContent() {
		const chats = this._getChats()
		console.log('chats ', chats)
		Object.keys(chats).forEach(c => console.log('context ', chats[c]))
		if (this.state.pickingTopic) {
			return (<Picker>
				{Object.keys(chats).map(c => (
					<Picker.Item label={chats[c].context} key={chats[c]._id}/>
				))}
			</Picker>)
		}
		console.log('Get chat result ', this._getChat())
		return (
			<GiftedChat
				loadEarlier={true}
				messages={this.state.messages}
				onSend={this.onSend}
				user={{
					_id: 1,
				}}/>
		)
	}

	componentDidMount() {
		this.dispatcher._fetchMessages(this._getEvent()._id, this._getChat()._id, this._getChat().accessCode, 10)
	}

	render() {
		return (
			<Container>
				<Grid>
					<Row size={1}>
						<Text style={{alignSelf: 'center'}}
							  onPress={() =>
							  	this.setState({...this.state, pickingTopic: !this.state.pickingTopic})}
						>
							Topic: {this._getChat().context}
						</Text>
					</Row>
					<Row size={9}>
						{this._renderContent()}
					</Row>
				</Grid>
			</Container>
		)
	}
}

export default connect(
	(state) => ({ events: state.event, chats: state.chat })
)(Chat)

