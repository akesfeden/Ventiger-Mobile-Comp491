import {
	INIT_CHAT,
	INC_CHAT
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
		case INC_CHAT:
			return {
				...state,
				[action.eventId]: {
					...state[action.eventId],
					[action.chatId]: {
						...state[action.eventId][action.chatId],
						messageInc: action.num
					}
				}
			}
		default:
			return state
	}
}