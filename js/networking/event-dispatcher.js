import socket from './socket'
import {
	initEvent,
	updateEvent,
	registerMe,
	addTodo,
	todoAction
} from '../actions/event-actions'
// TODO: reconsider client tool
import client from '../client'
import {gql, graphql} from 'react-apollo'
import getStoreAccess from '../store-access'
import reqres from './io-reqres'
let store = null;
const io = socket.io;
import token from '../token'

export default class EventDispatcher {

	constructor(_id) {
		this.store = getStoreAccess().store
		this._id = _id
		this.subQueue = []
		this._setup()
	}

	async _setup() {
		await this._setupSubs()
		this._setupQuery()
	}

	async addTodo(todo) {
		const res = await reqres(`
			mutation ($body: TodoBody!){
				addTodo(eventId: "${this._id}", token: "${this.token}", body: $body) {
					_id
					description
					creator {
						name
						_id
					}
					description
					takersRequired
					takers {
						_id
						name
					}
					done
					createdAt
				}
			}
		`, {body: todo})
		if (res.errors) {
			console.warn('addTodo errors', res.errors)
			return false
		}
		this.store.dispatch(addTodo(this._id, res.data.addTodo))
		return true
	}

	async todoAction(todo, action) {
		//this.store.dispatch(addTodo(this._id, {...todo, action}))
		const res = await reqres(
			`mutation($eventId: ID!, $todoId: ID!, $action: TodoAction!, $token: String){
				performTodoAction(eventId: $eventId, todoId: $todoId, action: $action, token: $token)
			}`, {
				eventId: this._id,
				todoId: todo._id,
				action,
				token: this.token
			}
		)
		console.log('takeTodo Result ', res)
		if (res.errors || !res.data.performTodoAction) {
			console.warn('Mutation errors ', res.errors)
			this.store.dispatch(addTodo(this._id, todo))
			return false
		}
		//this.store.dispatch(addTodo(this._id, todo))
		return true
	}

	async _setupQuery() {
		this.token = await token().getToken()
		reqres(`query{
					viewer(token: "${this.token}"){
						id
						name
						event(_id: "${this._id}") {
							_id
							title
							info
							creator {
								 _id
			 					name
			 				}
			 				participants {
			 					_id
			 					name
			 					admin
			 				}
			 				time {
			 					startTime
			 					endTime
			 				}
			 				location {
			 					info
			 				}
			 				invites {
			 					_id
			 				}
			 				autoUpdateFields
			 				todos {
			 					_id
			 					description
			 					takersRequired
			 					takers {
			 						_id
			 						name
			 					}
			 					createdAt
			 					done
			 				}
						}
					}
				}
		`).then(res => {
			console.log('Query result ', res)
			if (res.errors) {
				console.warn('Graphql Errors ', res.errors)
				return
			}
			this.store.dispatch(registerMe({_id: res.data.viewer.id, name: res.data.viewer.name}))
			this.store.dispatch(initEvent(res.data.viewer.event))
			this.fetched = true
			for (let i = 0; i < this.subQueue.length; ++i) {
				store.dispatch(this.subQueue[i])
			}
			this.subQueue = []
		}).catch(err => {
			console.warn('Query err', err)
		})
	}

	handleSub(action) {
		if (!this.fetched) {
			this.subQueue.push(action)
		} else {
			this.store.dispatch(action)
		}
	}

	async _setupSubs() {
		let channels
		try {
			channels = await reqres(
				`subscription {
					updateEventSub(eventId: "${this._id}") {
						_id
						title
						time {
							startTime
							endTime
						}
						location {
							info
						}
					}
					addTodoSub(eventId: "${this._id}") {
						_id
			 			description
			 			takersRequired
			 			takers {
			 				_id
			 				name
			 			}
			 			createdAt
			 			done
					}
					performTodoActionSub(eventId: "${this._id}") {
						_id
			 			description
			 			takersRequired
			 			takers {
			 				_id
			 				name
			 			}
			 			createdAt
			 			done
					}
				}
			`)
			console.log('Channel names ', channels)
		} catch (err) {
			console.warn('Network error ', err)
			return
		}
		const io = socket.io
		io.on(channels.updateEventSub, data => {
			this.handleSub(updateEvent(this._id, data))
		})
		io.on(channels.addTodoSub, data => {
			console.log('Todo received ', data)
			this.handleSub(addTodo(this._id, data))
		})
		io.on(channels.performTodoActionSub,  data => {
			console.log('Todo action received', data)
			this.handleSub(addTodo(this._id, data))
		})
	}

}