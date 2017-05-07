import {
	INIT_CHAT
} from '../actions/types'

export default (state={}, action) => {
	switch (action.type) {
		case INIT_CHAT:
			let newEventData
			if (state[action.eventId]) {
				newEventData = {...state[action.eventId], [action.chatId]: action.payload}
			} else {
				newEventData = {[action.chatId]: action.payload}
			}
			return {
				...state,
				[action.eventId]: newEventData
			}
		default:
			return state
	}
}