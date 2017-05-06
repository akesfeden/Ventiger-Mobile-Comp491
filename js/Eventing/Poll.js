import React, {Component} from 'react'
import {Container, Content, Grid, Card, CardItem, ListItem, Button, Text, Col, Badge} from 'native-base'
import {Button as LButton} from 'react-native-elements'
import { connect } from 'react-redux'

class Poll extends Component {
	static navigationOptions = {
		title: ({state}) => {
			//return 'Some Event'
			return state.params.title
		},
	}

	constructor(props) {
		super(props)
		const {eventId, pollId, dispatcher} = this.props.navigation.state.params
		this.eventId = eventId
		this.pollId = pollId
		this.dispatcher = dispatcher
		this.state = {
			finalVotingResult: 'U' //unknown, symbol doesn't matter
		}
	}

	_getEvent() {
		return this.props.events[this.eventId]
	}

	_getPoll() {
		if (this._getEvent()) {
			return this._getEvent().polls.find(p => p._id === this.pollId)
		}
	}

	_getMe() {
		return this.props.events.me
	}

	_renderOptionContents(o) {
		const writings = []
		const textStyle = {fontSize: 15, marginTop:5}
		const formatTime = time => {
			const date = new Date(time)
			return date.toDateString() + ' ' + date.toTimeString().substring(0, 5)
		}
		if (o.time) {
			writings.push((<Text style={textStyle} key={o._id + '_time1'}>Start: {formatTime(o.time.startTime)}</Text>))
			writings.push((<Text style={textStyle} key={o._id + '_time2'}>End: {formatTime(o.time.endTime)}</Text>))
		}
		if (o.location) {
			writings.push((<Text style={textStyle} key={o._id + '_loc'}>Location: {o.location.info || o.location.address}</Text>))
		}
		if (writings.length === 0) {
			writings.push((<Text style={textStyle} key={o._id + '_desc'}>{o.description}</Text>))
		}
		return writings
	}

	_isVoted(o) {
		const me = this._getMe()
		console.log('Voters ', o.voters)
		return o.voters.some(v => v._id === me._id)
	}

	_canVote(o) {
		const poll = this._getPoll()
		let canVote = true
		if (poll.multi) {
			return !this._isVoted(o)
		}
		for (let i = 0; i < poll.options.length && canVote; ++i) {
			canVote &= !this._isVoted(poll.options[i])
		}
		return canVote
	}

	async _vote(o) {
		const poll = this._getPoll()
		this.setState({...this.state, finalVotingResult: 'U'})
		const res = await this.dispatcher.execVotingAction(this._getMe(), poll._id, o._id, 'VOTE')
		this.setState({...this.state, finalVotingResult: res})
	}

	async _unvote(o) {
		const poll = this._getPoll()
		const res = await this.dispatcher.execVotingAction(this._getMe(), poll._id, o._id, 'UNVOTE')
		this.setState({...this.state, finalVotingResult: res})
	}

	_renderButton(o) {
		const poll = this._getPoll()
		if (!poll.open) {
			return
		}
		if (this._canVote(o)) {
			return (
				<Button small primary onPress={() => this._vote(o)}>
					<Text>Vote</Text>
				</Button>
			)
		}
		if (this._isVoted(o)) {
			return (
				<Button small danger onPress={() => this._unvote(o)}>
					<Text>UnVote</Text>
				</Button>
			)
		}

	}

	_getWinner() {
		const poll = this._getPoll()
		if (!poll) {
			return
		}
		let maxId = null, maxVote = -1
		poll.options.forEach(o => {
			if (o.voters.length > maxVote) {
				maxId = o._id
				maxVote = o.voters.length
			} else if (o.voters.length == maxVote) {
				maxId = null
			}
		})
		return maxId
	}

	_renderOptions() {
		const poll = this._getPoll()
		if (!poll) {
			return
		}
		const winner = this._getWinner()
		const renderBadge = o => {
			if (winner === null) {
				return (<Badge info><Text>{String(o.voters.length)}</Text></Badge>)
			}
			if (o._id === winner) {
				return (<Badge success><Text>{String(o.voters.length)}</Text></Badge>)
			}
			return (<Badge warning><Text>{String(o.voters.length)}</Text></Badge>)
		}
		return Array.from(poll.options)
			//sort((o1, o2) => o2.voters.length > o1.voters.length)
			.map(o => {
			return (
				<ListItem key={o._id}>
					<CardItem>
						<Col size={4}>
							{this._renderOptionContents(o)}
						</Col>
						<Col size={1}>
							{renderBadge(o)}
						</Col>
						<Col size={2}>
							{this._renderButton(o)}
						</Col>
					</CardItem>
				</ListItem>
			)
		})
	}

	_renderVotingMessage () {
		if (this.state.finalVotingResult === false) {
			// TODO: consider whatsapp-like error handling (i.e, queue the action and redo)
			return (
				<Text style={{color: '#7a1211'}}>Voting encountered internal error</Text>
			)
		}
		if (this.state.finalVotingResult === true) {
			return (
				<Text style={{color: '#247a3b'}}>Your vote is registered</Text>
			)
		}

	}

	_renderCompleteButton() {
		const poll = this._getPoll()
		if (!poll || poll.creator._id !== this._getMe()._id || !poll.open) {
			return
		}
		return (
			<LButton
				buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#39b0aa'}}
				title='Close Poll'
				onPress={() => this.dispatcher.closePoll(poll._id)}
			/>
		)
	}

	_renderClosedStatus() {

	}

	render() {
		return (
			<Container>
				<Content>
					<Card>
						{this._renderOptions()}
					</Card>
					{this._renderVotingMessage()}
					{this._renderCompleteButton()}
				</Content>
			</Container>
		)
	}
}

export default connect(
	(state) => ({ events: state.event })
)(Poll)
