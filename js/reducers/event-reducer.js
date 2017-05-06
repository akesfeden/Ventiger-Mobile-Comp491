import {
	INIT_EVENT,
	UPDATE_EVENT,
	REGISTER_ME,
	NEW_TODO,
	NEW_POLL,
	POLL_VOTE,
	POLL_UNVOTE
} from '../actions/types'

export default (state={}, action) => {
	switch (action.type) {
		case INIT_EVENT:
			return {
				...state,
				[action.data._id]: action.data
			}
		case UPDATE_EVENT:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					...action.data
				}
			}
		case REGISTER_ME:
			return {
				...state,
				me: action.info
			}
		case NEW_TODO:
			const event = state[action._id]
			const todo = action.data
			const todos = event.todos.filter(t => t._id != todo._id)
			todos.push(todo)
			return {
				...state,
				[action._id]: {
					...state[action._id],
					todos
				}
			}
		case NEW_POLL:
			const event_ = state[action._id]
			const poll = action.data
			const polls = event_.polls.filter(p => p._id != poll._id)
			polls.push(poll)
			return {
				...state,
				[action._id]: {
					...event_,
					autoUpdateFields: [
						...event_.autoUpdateFields,
						poll.autoUpdateFields
					],
					polls
				}
			}
		case POLL_VOTE:
		case POLL_UNVOTE:
			const {voter, pollId, optionId, eventId} = action
			const thepoll = state[eventId].polls.find(p => p._id === pollId)
			const theoption = thepoll.options.find(o => o._id === optionId)
			const voters = theoption.voters.filter(v => v._id !== voter._id)
			if (action.type === POLL_VOTE) {
				voters.push(voter)
			}
			const newoption = {...theoption, voters}
			const options = []
			thepoll.options.forEach(o => {
				if (o._id === optionId) {
					options.push(newoption)
				} else {
					options.push(o)
				}
			})
			const newpoll = {...thepoll, options}
			const newpolls = state[eventId].polls.filter(p => p._id !== pollId)
			newpolls.push(newpoll)
			const newevent = {...state[eventId], polls: newpolls}
			console.log('New polls ', newpolls)
			return {
				...state,
				[eventId]: newevent
			}
		default:
			return state
	}
}