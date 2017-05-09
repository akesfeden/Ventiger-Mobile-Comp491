import {
	INIT_CHAT,
	INC_CHAT,
	NEW_MESSAGE
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
		case NEW_MESSAGE:
			let newMessages
			if (Array.isArray(action.data)) {
				newMessages = [...(state[action.eventId][action.chatId].messages || []), ...action.data]
			} else {
				newMessages = [...(state[action.eventId][action.chatId].messages), action.data]
			}
			const keys = {}
			newMessages.forEach(m => {
				keys[m.index] = m
			})
			let newMessages_ = Object.keys(keys).sort().map(k => newMessages[k])
			return {
				...state,
				[action.eventId]: {
					...state[action.eventId],
					[action.chatId]: {
						...state[action.eventId][action.chatId],
						messages: newMessages_
					}
				}
			}
		default:
			return state
	}
}