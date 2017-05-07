import {
	INIT_CHAT
} from './types'

export const initChat = (eventId, chatId, payload) => {
	return {
		type: INIT_CHAT,
		eventId,
		chatId,
		payload
	}
}