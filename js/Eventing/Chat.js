import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { Picker } from 'react-native'
import { Container, Grid, Row, Text, CardItem, Badge, Card, Col } from 'native-base'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'

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
		this.todo = this.props.navigation.state.params.todo
	}

	onSend(messages = []) {
		console.log('Messages ', messages)
			/*this.setState((previousState) => {
			return {
				messages: GiftedChat.append(previousState.messages, messages),
			}
		})*/
		const chat = this._getChat()
		messages.forEach(m => this.dispatcher.sendMessage(
			chat._id,
			chat.accessCode,
			m.text
		))
	}

	_getMe() {
		return this.props.events.me
	}

	_setupChats() {
		console.log('Called')
		const chat = this._getChat()
		const event = this._getEvent()
		if (event && chat && chat.messages) {
			console.log('Messages ', chat.messages)
			const messages = chat.messages
				.filter(m => !m.removed)
				.map(m => ({
					_id: m.index,
					text: m.content,
					createdAt: new Date(m.sentAt),
					user: event.participants.find(p => p._id == m.sender)
				}))
				.reverse()
			console.log('State was set with messages ', messages)
			return messages
		}
		console.log('Exited message setting...')
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

	_renderTopicGroup(group) {
		return group.map(g => {
			if (g) {
				return (
					<Col size={1}>
						<Text onPress={() => this.setState({...this.state, pickingTopic: !this.state.pickingTopic, chatId: g._id})}>{g.context}</Text>
						<Badge info><Text>{g.messageInc}</Text></Badge>
					</Col>
				)
			}
		})
	}

	_renderChatTopics() {
		const chats = this._getChats()
		const sorted = Array.from(Object.keys(chats).map(k => chats[k]))
			.filter(c => !c.context.startsWith('t_'))
			.sort((c1, c2) => c1.context > c2.context)
		const rows = []
		const step = 3
		for (let i = 0; i < sorted.length; i += step) {
			const group = []
			for (let j = 0; j < step; ++j) {
				group.push(sorted[i+j])
			}
			rows.push((<CardItem>
				<Row size={1}>
					{this._renderTopicGroup(group)}
				</Row>
			</CardItem>))
		}
		return rows
	}

	_renderContent() {
		const chats = this._getChats()
		console.log('Get chat result ', this._getChat())
		if (this.state.pickingTopic) {
			return (
				<Card>
					{this._renderChatTopics()}
				</Card>
			)
		}
		return (
			<GiftedChat
				loadEarlier={true}
				messages={this._setupChats()}
				onSend={this.onSend}
				user={{
					_id: this._getMe()._id,
				}}/>
		)
	}

	componentDidMount() {
		this._setup()
	}

	async _setup() {

		await this.dispatcher.fetchMessages(this._getEvent()._id, this._getChat()._id, this._getChat().accessCode, 10)
		//setTimeout(() => this._setupChats(), 100)
	}

	_renderTopic() {
		if (this.todo) {

			return (<Row size={1}>
				<Text style={{alignSelf: 'center'}}>
					TODO: {this._getTodo().description}
				</Text>
			</Row>)
		}
		return (
			<Row size={1}>
				<Text style={{alignSelf: 'center'}}>
					Topic: {this._getChat() && this._getChat().context}
				</Text>
			</Row>
		)
	}

	_getTodo() {
		if (this.todo) {
			return this._getEvent().todos.find(t => t._id === this.todo._id)
		}
	}

	_getChatters() {
		if (this._getTodo()) {
			return this._getTodo().takers.map(t=>t.name).join(',')
		}
		return this._getEvent().participants.map(p => p.name).join(',')
	}

	_renderChatters() {
		return (
			<Row size={1}>
				<Text>
					{this._getChatters()}
				</Text>
			</Row>
		)
	}

	render() {
		return (
			<Container>
				<Grid>
					{this._renderTopic()}
					{this._renderChatters()}
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

