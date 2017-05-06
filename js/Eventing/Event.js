import React, {Component} from "react"
import {Image} from "react-native"
import {Button as EButton} from "react-native-elements";
import {Grid, Container, Row, Col, Card, CardItem, Content, Text, Title, Button, List, ListItem, Icon} from 'native-base'
const strings = require('../strings').default.profile
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Dispatcher from '../networking/event-dispatcher'

class Event extends Component {
	static navigationOptions = {
		title: ({state}) => {
			//return 'Some Event'
			return state.params.title
		},
	}

	constructor(props) {
		super(props)
		this.state = {data: {}, filterMyTodos: false, focus: null}
	}

	_getEvent() {
		return this.props.events[this.props.navigation.state.params._id] || {}
	}

	_getMe() {
		return this.props.events.me || {}
	}

	componentDidMount() {
		this.dispatcher = new Dispatcher(this.props.navigation.state.params._id)
	}

	// TODO: make this work
	componentWillReceiveProps(nextProps) {
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
		return event.polls.find(p => p.autoUpdateFields.some(f => f === fieldname))
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

	_renderEventInfo() {
		const event = this._getEvent()
		const autoUpdate = event.autoUpdateFields || []
		const info = []
		const autoUpdateText = (field, poll) => autoUpdate.includes(field)
			? 'connected to poll ' + poll.title
			: ''
		if (event.location || autoUpdate.includes('location')) {
			const locationPoll = this._getConnectedPoll('location')
			info.push(
				(<CardItem style={{paddingTop:0}}>
					<Text style={{fontSize: 14}} onPress={() => this._navigateToPoll(locationPoll)}>
						Location: {(event.location && (event.location.info || event.location.address) || '') + '\nEvent location is' + autoUpdateText('location', locationPoll)}
					</Text>
				</CardItem>)
			)
		}
		if (event.time || autoUpdate.includes('time')) {
			console.log('Time ', CardItem)
			const formatTime = time => {
				const date = new Date(time)
				return date.toDateString() + ' ' + date.toTimeString().substring(0, 5)
			}
			const timePoll = this._getConnectedPoll('time')
			info.push(
				(<CardItem style={{paddingTop:0}}>
					<Text style={{fontSize: 14}}>
						{event.time && (formatTime(event.time.startTime)  + " - " + formatTime(event.time.endTime)) || ''} {'\n'}Event time is {autoUpdateText('time', timePoll)}
					</Text>
				</CardItem>
			))
		}
		return info
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
					<CardItem>
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

	_renderContents() {
		if (this.state.focus == 'todo') {
			return (
				<Row size={8}>
					<Content>
						<Card>
							<CardItem itemDivider>
								<Title>Todos</Title>
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
		}
		return [
			(<Row size={2}>
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
							<Title>Todos</Title>
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
				<Content style={{marginTop: 10}}>
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

	}

	render() {
		return (
			<Container>
				<Grid>
					<Row size={2}>
						<Card style={{marginBottom:0, paddingBottom:0}}>
							<CardItem>
								<Col size={1} >
									<Image
										source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}

										style={{"width": 75, "height":75, marginTop: 0,
											borderRadius: 25, alignSelf: 'center'}}
									/>
								</Col>
								<Col size={3} style={{alignSelf: 'center'}}>
									{this._renderParticipants()}
									{this._renderCreator()}
								</Col>
							</CardItem>
						</Card>
					</Row>
					{this._renderContents()}
				</Grid>
			</Container>
		)
	}
}

export default connect(
	(state) => ({ events: state.event })
)(Event)


