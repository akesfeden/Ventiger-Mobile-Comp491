import React, {Component} from "react"
import {Image} from "react-native"
import {Grid, Container, Row, Col, Card, CardItem, Content, Text, Title,
	Button, List, ListItem, Icon, Badge, Tab, Tabs, Header
} from 'native-base'
const strings = require('../strings').default.profile
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Dispatcher from '../networking/event-dispatcher'
import ChatDispatcher from '../networking/chat-dispatcher'

class Event extends Component {
	static navigationOptions = {
		title: ({state}) => {
			//return 'Some Event'
			return state.params.title
		},
	}

	constructor(props) {
		super(props)
		this.state = {data: {}, filterMyTodos: false, focus: null, propCnt: 1}
	}

	_getEvent() {
		return this.props.events[this.props.navigation.state.params._id] || {}
	}

	_getMe() {
		return this.props.events.me || {}
	}

	componentDidMount() {
		this.dispatcher = new Dispatcher(this.props.navigation.state.params._id)
		this.chatDispatcher = new ChatDispatcher(this.props.navigation.state.params._id)
	}

	// TODO: make this work
	componentWillReceiveProps(nextProps) {
		this.setState({...this.state, propCnt: this.state.propCnt+1})
		if (this._getEvent()._id) {
			const event = this._getEvent()
			console.log('Next Props ', nextProps.events[event._id])
			const nextTitle = nextProps.events[event._id].title
			if (event.title !== nextTitle) {
				console.log("New Title", nextTitle)
				/*this.props.navigation.setState(
					{
						...this.props.navigation.state,
						params: nextProps
					},
				)*/
				this.props.navigation.dispatch(
					NavigationActions.setParams({
						params: {
							...this.props.navigation.state.params,
							title: nextTitle
						},
						key: 'Event' //FIXME: this needs editing
					})
				)
			}
		}
	}

	_renderParticipants() {
		const viewCount=3
		let cnt = 0
		const p = this._getEvent().participants
		let res = ''
		if (p) {
			for(let i = 0; i < Math.min(p.length, viewCount); ++i) {
				res += (i!==0 ? ", " : "") + p[i].name
			}
			if(viewCount < p.length) {
				res += " and " + (p.length - Math.min(p.length, viewCount)) + " others"
			}
		}
		return (
			<Text>{res}</Text>
		)
	}

	_renderCreator() {
		if (this._getEvent().creator) {
			return (
				<Text>
					{"Created by: " + (this._getEvent().creator && this._getEvent().creator.name)}
				</Text>
			)
		}
		return null
	}

	_getConnectedPoll(fieldname) {
		const event = this._getEvent()
		if (!event.polls) {
			return
		}
		return event.polls.find(p => p.open && p.autoUpdateFields.some(f => f === fieldname))
	}

	_navigateToPoll(poll) {
		if (!poll) {
			return
		}
		this.props.navigation.navigate('Poll', {
			pollId: poll._id,
			title: poll.title,
			eventId: this._getEvent()._id,
			dispatcher: this.dispatcher
		})
	}

	_renderPoll(poll, fieldname) {
		if (!poll) {
			return
		}
		return (
			<Text onPress={() => this._navigateToPoll(poll)}>
				Poll: {poll.title}
			</Text>
		)
	}

	_renderEventInfo() {
		const event = this._getEvent()
		const locationPoll = this._getConnectedPoll('location')
		const timePoll = this._getConnectedPoll('time')
		const formatTime = time => {
			const date = new Date(time)
			return date.toDateString() + ' ' + date.toTimeString().substring(0, 5)
		}
		return (
			<CardItem>
				<Col size={1}>
					<Row>
						<Text>Location: {event.location && event.location.info || 'not set'}</Text>
					</Row>
					<Row>
						{this._renderPoll(locationPoll, 'Location')}
					</Row>
				</Col>
				<Col size={2}>
					<Row>
						<Text>From: {event.time && formatTime(event.time.startTime) || 'not set'}</Text>
					</Row>
					<Row>
						<Text>To: {event.time && formatTime(event.time.startTime) || 'not set'}</Text>
					</Row>
					<Row>
						{this._renderPoll(timePoll, 'Time')}
					</Row>
				</Col>
			</CardItem>
		)
		/*return [
			(<CardItem style={{paddingTop:0}}>
				<Text onPress={() => this._navigateToPoll(locationPoll)}>
					Location: {(event.location && (event.location.info || event.location.address) || '')}
				</Text>
				{this._renderPoll(locationPoll, 'Location')}
			</CardItem>),
			(<CardItem style={{paddingTop:0}}>
				<Text onPress={() => this._navigateToPoll(timePoll)}>
					{event.time && (formatTime(event.time.startTime)  + " - " + formatTime(event.time.endTime)) || 'Time is not set'}
				</Text>
				{this._renderPoll(timePoll, 'Time')}
			</CardItem>),
			(<CardItem>
				<Button small success onPress={() => this.props.navigation.navigate('Chat', {event: this._getEvent(), topic: 'Event Info'})}>
					<Text>Discuss</Text>
				</Button>
			</CardItem>)
		]*/
	}

	_renderTodos() {
		const event = this._getEvent()
		const me = this._getMe()
		if (!event.todos) {
			return null
		}
		console.log('Event ', event)
		const renderButtons = (todo) => {
			if (todo.done) {
				return (
					<Col size={2}>
						<Text>Done.</Text>
					</Col>
				)
			}
			else if (todo.takers && todo.takers.some(t=>t._id === me._id)) {
				return [
					(<Col size={2}>
						<Button small success onPress={()=>this.dispatcher.todoAction(todo, 'DONE')}><Text>Done</Text></Button>
					</Col>),
					(<Col size={2}>
						<Button small danger onPress={()=>this.dispatcher.todoAction(todo, 'RELEASE')}><Text>Leave</Text></Button>
					</Col>)
				]
			}
			return (
				<Col size={2}>
					<Button small primary onPress={()=>this.dispatcher.todoAction(todo, 'TAKE')}>
						<Text>Take</Text>
					</Button>
				</Col>
			)
		}
		const todos_ = this.state.filterMyTodos ? event.todos.filter(t=>t.takers.some(t=>t._id === me._id)) : event.todos
		const todos = todos_
			.sort((t1, t2) => Number(new Date(t2.createdAt)) > Number(new Date(t1.createdAt)))
			.filter(t=>!t.done)
		event.todos.filter(t=>t.done).forEach(t=>todos.push(t))
		return todos.map(todo => {
			let takers = String(Math.max(todo.takersRequired - todo.takers.length, 0)) + ' more taker(s) needed'
			takers += todo.takers.length ? '\n@ ' + todo.takers.map(t=>t.name).join(",") : ''
			return (
				<ListItem key={todo._id} style={{padding:0}}>
					<CardItem onPress = {
						() => {
							if (!todo.takers.some(t => t._id === this._getMe()._id)) {
								return
							}
							let chat = Object.keys(this.props.chats[this._getEvent()._id]).find(cid => this.props.chats[this._getEvent()._id][cid].context === 't_' + todo.description)
							if (chat) {
								chat = this.props.chats[this._getEvent()._id][chat]
								console.log('Chat found ', chat)
								this.props.navigation.navigate('Chat',  {title: todo.description,
						 			eventId: this._getEvent()._id, chatId: chat._id, dispatcher: this.chatDispatcher,
						 			todo
						 		})
							}
						 }}>
						<Col size={5}>
							<Text style={{fontSize: 15}}>{todo.description+'\n'+takers}</Text>
						</Col>
						{renderButtons(todo)}
					</CardItem>
				</ListItem>
			)
		})
	}

	_renderPolls() {
		const event = this._getEvent()
		if (!Object.keys(event).length) {
			return
		}
		const polls = event.polls.filter(p => p.open).sort((t1, t2) => Number(new Date(t2.createdAt)) > Number(new Date(t1.createdAt)))
		const inactivePolls = event.polls.filter(p => !p.open)
		inactivePolls.forEach(p => polls.push(p))
		return polls.map(poll => {
			return (
				<ListItem key={poll._id}
				>
					<CardItem onPress={() => {
						  		this.props.navigation.navigate('Poll', {
						  			pollId: poll._id, title: poll.title, eventId: event._id, dispatcher: this.dispatcher
						  		})
						  	}}>
						<Row>
							<Text>{poll.title}</Text>
						</Row>
						<Row>
							<Text>{poll.options.length} options</Text>
						</Row>
					</CardItem>
				</ListItem>
			)
		})
	}

	_getChats(asArray=true) {
		const event = this._getEvent()
		if (!Object.keys(event).length || !this.props.chats || !this.props.chats[event._id]) {
			return asArray && [] || {}
		}
		const chats = this.props.chats[event._id]
		if (asArray) {
			return Object.keys(chats).map(k => chats[k])
		}
		return chats
	}

	_renderTopicGroup(group) {
		return group.map(g => {
			if (g) {
				return (
					<Col size={1}>
						<Text  onPress={() => this.props.navigation.navigate('Chat',  {title: this._getEvent().title,
						 	eventId: this._getEvent()._id, chatId: g._id, dispatcher: this.chatDispatcher
						 })}>{g.context}</Text>
						<Badge info><Text>{g.messageInc}</Text></Badge>
					</Col>
				)
			}
		})
	}

	_renderChatTopics() {
		const sorted = Array.from(this._getChats())
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

	render() {
		return (
			<Container>
				<Grid>
					<Row size={2}>
						<Card style={{margin:0, paddingBottom:0}}>
							<CardItem>
								<Col size={1} >
									<Image
										source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}

										style={{"width": 60, "height":60, marginTop: 0,
											borderRadius: 20, alignSelf: 'center'}}
									/>
								</Col>
								<Col size={3} style={{alignSelf: 'center'}}>
									{this._renderParticipants()}
									{this._renderCreator()}
								</Col>
							</CardItem>
						</Card>
					</Row>
					<Row size={2}>
						<Content>
							{this._renderEventInfo()}
						</Content>
					</Row>
					<Row size={9}>
						<Content>
							<Tabs>
								<Tab heading="Chat">

										<CardItem itemDivider onPress = {() => this.setState({...this.state, focus: 'chat'})}>
											<Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('CreateChat', {
														dispatcher: this.chatDispatcher, event: this._getEvent()})
											}>
												<Icon name='add'/>
											</Button>
										</CardItem>
										{this._renderChatTopics()}

								</Tab>
								<Tab heading="TODOs">

										<CardItem  onPress = {() => this.setState({...this.state, focus: 'todo'})} itemDivider>
											<Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('AddTodo', {
													dispatcher: this.dispatcher})
										}>
												<Icon name='add'/>
											</Button>
											<Button small info bordered style={{marginLeft: 20}}
													onPress={() => this.setState({...this.state, filterMyTodos:!this.state.filterMyTodos})}
											>
												<Text>{this.state.filterMyTodos ? 'Show All' : 'Filter Mines'}</Text>
											</Button>
										</CardItem>
										{this._renderTodos()}

								</Tab>
								<Tab heading="Polls">

										<CardItem onPress = {() => this.setState({...this.state, focus: 'poll'})} itemDivider>
											<Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('CreatePoll', {
													dispatcher: this.dispatcher})
										}>
												<Icon name='add'/>
											</Button>
										</CardItem>
										{this._renderPolls()}

								</Tab>
							</Tabs>
						</Content>
					</Row>
				</Grid>
			</Container>
		)
	}


}
//{this._renderContents()}


export default connect(
	(state) => ({ events: state.event, chats: state.chat })
)(Event)


// DEATH CODE

/*_renderContents() {
 if (this.state.focus == 'todo') {
 return (
 <Row size={8}>
 <Content>
 <Card>
 <CardItem itemDivider>
 <Title>TODOs</Title>
 <Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('AddTodo', {
 dispatcher: this.dispatcher})
 }>
 <Icon name='add'/>
 </Button>
 <Button small info bordered style={{marginLeft: 20}}
 onPress={() => this.setState({...this.state, filterMyTodos:!this.state.filterMyTodos})}
 >
 <Text>{this.state.filterMyTodos ? 'Show All' : 'Filter Mines'}</Text>
 </Button>
 <Button small info bordered style={{marginLeft: 10}}
 onPress={() => this.setState({...this.state, focus: null})}
 >
 <Text>Minimize</Text>
 </Button>
 </CardItem>
 {this._renderTodos()}
 </Card>
 </Content>
 </Row>
 )
 } else if(this.state.focus == 'poll') {
 return (<Row size={8}>
 <Content>
 <Card>
 <CardItem itemDivider>
 <Title>Polls</Title>
 <Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('CreatePoll', {
 dispatcher: this.dispatcher})
 }>
 <Icon name='add'/>
 </Button>
 <Button small info bordered style={{marginLeft: 20}}
 onPress={() => this.setState({...this.state, focus: null})}
 ><Text>Minimize</Text></Button>
 </CardItem>
 {this._renderPolls()}
 </Card>
 </Content>
 </Row>)
 } else if (this.state.focus == 'chat') {
 return (<Row size={8}>
 <Content style={{marginTop: 5}}>
 <Card>
 <CardItem itemDivider onPress = {() => this.setState({...this.state, focus: 'chat'})}>
 <Title>Chat Topics</Title>
 <Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('CreateChat', {
 dispatcher: this.chatDispatcher, event: this._getEvent()})
 }>
 <Icon name='add'/>
 </Button>
 <Button small info bordered style={{marginLeft: 20}}
 onPress={() => this.setState({...this.state, focus: null})}
 ><Text>Minimize</Text></Button>
 </CardItem>
 {this._renderChatTopics()}
 </Card>
 </Content>
 </Row>)
 }
 return [
 (<Row size={3}>
 <Content>
 <Card>
 <CardItem itemDivider>
 <Title>Event Info</Title>
 </CardItem>
 {this._renderEventInfo()}
 </Card>
 </Content>
 </Row>
 ),
 (<Row size={4} style={{marginTop: 5}}>
 <Content>
 <Card>
 <CardItem  onPress = {() => this.setState({...this.state, focus: 'todo'})} itemDivider>
 <Title>TODOs</Title>
 <Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('AddTodo', {
 dispatcher: this.dispatcher})
 }>
 <Icon name='add'/>
 </Button>
 <Button small info bordered style={{marginLeft: 20}}
 onPress={() => this.setState({...this.state, filterMyTodos:!this.state.filterMyTodos})}
 >
 <Text>{this.state.filterMyTodos ? 'Show All' : 'Filter Mines'}</Text>
 </Button>
 </CardItem>
 {this._renderTodos()}
 </Card>
 </Content>
 </Row>),
 (<Row size={4}>
 <Content style={{marginTop: 5}}>
 <Card>
 <CardItem itemDivider onPress = {() => this.setState({...this.state, focus: 'chat'})}>
 <Title>Chat Topics</Title>
 <Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('CreateChat', {
 dispatcher: this.chatDispatcher, event: this._getEvent()})
 }>
 <Icon name='add'/>
 </Button>
 </CardItem>
 {this._renderChatTopics()}
 </Card>
 </Content>
 </Row>),
 (<Row size={5}>
 <Content style={{marginTop: 5}}>
 <Card >
 <CardItem onPress = {() => this.setState({...this.state, focus: 'poll'})} itemDivider>
 <Title>Polls</Title>
 <Button small info bordered style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('CreatePoll', {
 dispatcher: this.dispatcher})
 }>
 <Icon name='add'/>
 </Button>
 </CardItem>
 {this._renderPolls()}
 </Card>
 </Content>
 </Row>)
 ]
 }*/

