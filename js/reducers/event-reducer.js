import {
	INIT_EVENT,
	UPDATE_EVENT,
	REGISTER_ME,
	NEW_TODO,
	NEW_POLL,
	POLL_VOTE,
	POLL_UNVOTE,
	POLL_CLOSE
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
			const newAutos = [
				...event_.autoUpdateFields.filter(f => !poll.autoUpdateFields.includes(f)),
				poll.autoUpdateFields
			]
			return {
				...state,
				[action._id]: {
					...event_,
					autoUpdateFields: newAutos,
					polls
				}
			}
		case POLL_VOTE:
		case POLL_UNVOTE:
			const {voter, pollId, optionId, eventId, autoUpdate, fieldsToUnset} = action
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
			if (fieldsToUnset && fieldsToUnset.length) {
				console.log('Unsetting is being performed')
				const unset = {}
				fieldsToUnset.forEach(f => unset[f] = null)
				return {
					...state,
					[eventId]: {
						...newevent,
						...unset,
					}
				}
			}
			if (autoUpdate) {
				console.log('Autoupdate is being performed')
				const update = {}
				thepoll.autoUpdateFields.forEach(f => {
					update[f] = autoUpdate[f]
				})
				return {
					...state,
					[eventId]: {
						...newevent,
						...update
					}
				}
			}
			console.log('New polls ', newpolls)
			return {
				...state,
				[eventId]: newevent
			}
		case POLL_CLOSE:
			const allPolls = state[action.eventId].polls
			const upPolls = []
			allPolls.forEach(p => {
				if (p._id === action.pollId) {
					upPolls.push({...p, open: false})
				} else {
					upPolls.push(p)
				}
			})
			const myAutoUpdates = allPolls.find(p => p._id === action.pollId).autoUpdateFields
			const newAutoUpdates = state[action.eventId].autoUpdateFields.filter(f => !myAutoUpdates.includes(f))
			const endUpdate = action.update || {}
			return {
				...state,
				[action.eventId]: {
					...state[action.eventId],
					...endUpdate,
					autoUpdateFields: newAutoUpdates,
					polls: upPolls
				}
			}
		default:
			return state
	}
}