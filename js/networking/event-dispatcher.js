import socket from './socket'
import {
	initEvent,
	updateEvent,
	registerMe,
	addTodo,
	todoAction,
	addPoll,
	votingAction
} from '../actions/event-actions'
// TODO: reconsider client tool
import reqres from './io-reqres'
import token from '../token'
import getStoreAccess from '../store-access'

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

	async createPoll(body) {
		const res = await reqres(
			`mutation($body: PollBody!) {
				createPoll(token: "${this.token}", body: $body, eventId: "${this._id}") {
					_id
					title
					autoUpdateFields
					autoUpdateType
					open
					multi
					options {
						_id
						description
						location {
							info
						}
						time {
							startTime
							endTime
						}
						voters {
							_id
							name
						}
					}
					createdAt
				}
			}`, {body})
		console.log('Poll creation result ', res.data)
		if (res.errors) {
			console.warn('Poll creation errors ', res.errors)
			return false
		}
		this.store.dispatch(addPoll(this._id, res.data.createPoll))
		return true
	}

	async execVotingAction(voter, pollId, optionId, action) {
		const res = await reqres(`
			mutation {
				performVotingAction(token: "${this.token}", eventId: "${this._id}" pollId: "${pollId}", optionId: "${optionId}", action: ${action})
			}
		`)
		if (res.errors) {
			console.warn('Poll voting errors ', res.errors)
			return false
		}
		if (!res.data.performVotingAction) {
			console.warn('Voting failed')
			return false
		} else {
			console.log('Poll voting result ', res)
		}
		this.store.dispatch(votingAction(voter, this._id, pollId, optionId, action))
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
			 				polls {
			 					_id
								title
								autoUpdateFields
								autoUpdateType
								open
								multi
								options {
									_id
									description
									location {
										info
									}
									time {
										startTime
										endTime
									}
									voters {
										_id
										name
									}
								}
								createdAt
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

	//TODO: use fragments
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
					createPollSub(eventId: "${this._id}") {
						_id
						title
						autoUpdateFields
						autoUpdateType
						open
						multi
						options {
							_id
							description
							location {
								info
							}
							time {
								startTime
								endTime
							}
							voters {
								_id
								name
							}
						}
						createdAt
					}
					performVotingActionSub(eventId: "${this._id}") {
						performer {
							_id
							name
						}
						action
						optionId
						pollId
						fieldsToUnset
						autoUpdate {
							location {
								info
							}
							time {
								startTime
								endTime
							}
						}
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
		io.on(channels.createPollSub, data => {
			console.log('New poll received ', data)
			this.handleSub(addPoll(this._id, data))
		})
		io.on(channels.performVotingActionSub, data => {
			console.log('New vote received ', data)
			this.handleSub(votingAction(data.performer, this._id, data.pollId, data.optionId, data.action, data.autoUpdate, data.fieldsToUnset))
		})
	}



}