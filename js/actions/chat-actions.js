import {
	INIT_CHAT,
	INC_CHAT,
	NEW_MESSAGE
} from './types'

export const initChat = (eventId, chatId, payload) => {
	return {
		type: INIT_CHAT,
		eventId,
		chatId,
		payload
	}
}

export const incrementChat = (eventId, chatId, num) => ({
	type: INC_CHAT,
	eventId,
	chatId,
	num
})

export const newMessage = (eventId, chatId, data) => ({
	type: NEW_MESSAGE,
	eventId,
	chatId,
	data
})