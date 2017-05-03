import {
	INIT_EVENT,
	UPDATE_EVENT,
	REGISTER_ME,
	NEW_TODO,
	TODO_TAKE,
	TODO_DONE,
	TODO_RELEASE
} from './types'

const identity = (type, _id, data) => ({
	type,
	_id, //Event Id should be given
	data //Overwrites _id field of event id
})

export const initEvent = data => identity(INIT_EVENT, null, data)

export const updateEvent = (_id, data) => identity(UPDATE_EVENT, _id, data)

export const registerMe = info => ({
	type: REGISTER_ME,
	info
})

export const addTodo = (_id, todo) => identity(NEW_TODO, _id, todo)

export const todoAction = (_id, data) => {
	const typeMap = {
		'TAKE': TODO_TAKE,
		'DONE': TODO_DONE,
		'RELEASE': TODO_RELEASE
	}
	return {
		...data,
		_id,
		type: typeMap[data.action]
	}
}