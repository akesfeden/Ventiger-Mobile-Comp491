import socket from './socket'
import reqres from './io-reqres'
import token from '../token'
import getStoreAccess from '../store-access'
import {
	initChat,
	incrementChat
} from '../actions/chat-actions'

// TODO: superclass
// TODO: consider synchronization problems
export default class ChatDispatcher {
	constructor(eventId) {
		this.store = getStoreAccess().store
		this.eventId = eventId
		this.subQueue = []
		this._setup()
		this.fetched = false
	}

	async _setup() {
		this.token = await token().getToken()
		this._setupSubs()
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

	_setupQuery() {
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
			this.fetched = true
			data.data.viewer.chats.forEach(chat => {
				this.store.dispatch(initChat(this.eventId, chat._id, chat))
				this._subscribeTopicInc(chat._id)
			})

		}).catch(err => {
			console.warn('Error fetching chats ', err)
		})
	}

	handleSub(action) {
		if (!this.fetched) {
			this.subQueue.push(action)
		} else {
			this.store.dispatch(action)
		}
	}

	async _subscribeTopicInc(chatId) {
		const channelNames = await reqres(`subscription {
			messageIncSub(chatId: "${chatId}")
		}`)
		console.log('Channel names for chat subscriptions ', channelNames)
		socket.io.on(channelNames.messageIncSub, data => {
			console.log('Increment data received')
			this.store.dispatch(incrementChat(this.eventId, chatId, data))
		})
	}

	async _setupSubs() {
		const channelNames = await reqres(`subscription {
			createChatSub(eventId: "${this.eventId}", token: "${this.token}") {
				_id
				context
				messageInc
				accessCode
			}
		}`)
		const io = socket.io
		console.log('Channel names for chat subscriptions ', channelNames)
		io.on(channelNames.createChatSub, data => {
			console.log('Chat creation sub result received ', data)
			this.handleSub(initChat(this.eventId, data._id, data))
			setTimeout(() => this._subscribeTopicInc(data._id), 500) //latency for waiting store
		})
	}

}