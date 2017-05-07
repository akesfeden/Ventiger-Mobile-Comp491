import socket from './socket'
import reqres from './io-reqres'
import token from '../token'
import getStoreAccess from '../store-access'
import {
	initChat
} from '../actions/chat-actions'

export default class ChatDispatcher {
	constructor(eventId) {
		this.store = getStoreAccess().store
		this.eventId = eventId
		this.subQueue = []
		this._setup()
	}

	async _setup() {
		this.token = await token().getToken()
		this._setupQuery()
	}

	async newChat(eventId, context) {
		const res = await reqres(`mutation($body: EventChatInput!) {
			createChat(body: $body, token: "${this.token}") {
				_id
				context
				messageInc
				messages {
					index
					content
					sentAt
					sender
				}
			}
		}`, {body: {
				eventId,
				context
			},
		})
		if (res.errors) {
			console.warn('Chat cration errors ', res.errors)
			return false
		}
		const chat = res.data.createChat
		this.store.dispatch(initChat(eventId, chat._id, chat))
		return true
	}

	async _setupQuery() {
		reqres(`query {
			viewer(token: "${this.token}") {
				chats(eventId: "${this.eventId}") {
					_id
					context
					messageInc
					accessCode
				}
			}
		}`).then(data => {
			console.log('Date fetched ', data)
			if (data.errors) {
				console.warn('Error querying chats ', data.errors)
				return
			}
			data.data.viewer.chats.forEach(chat => {
				this.store.dispatch(initChat(this.eventId, chat._id, chat))
			})
		}).catch(err => {
			console.warn('Error fetching chats ', err)
		})
	}


}