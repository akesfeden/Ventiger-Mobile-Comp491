import React, {Component} from 'react'
import {Container, Content, Grid, Card, CardItem, ListItem, Button, Text, Col} from 'native-base'
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

	_renderButton(o) {
		if (this._canVote(o)) {
			return (
				<Button small primary>
					<Text>Vote</Text>
				</Button>
			)
		}
		if (this._isVoted(o)) {
			return (
				<Button small danger>
					<Text>Un-Vote</Text>
				</Button>
			)
		}

	}

	_renderOptions() {
		const poll = this._getPoll()
		if (!poll) {
			return
		}
		return poll.options.map(o => {
			return (
				<ListItem key={o._id}>
					<CardItem>
						<Col size={4}>
							{this._renderOptionContents(o)}
						</Col>
						<Col size={2}>
							{this._renderButton(o)}
						</Col>
					</CardItem>
				</ListItem>
			)
		})
	}


	render() {
		return (
			<Container>
				<Content>
					<Card>
						{this._renderOptions()}
					</Card>
				</Content>
			</Container>
		)
	}
}

export default connect(
	(state) => ({ events: state.event })
)(Poll)
