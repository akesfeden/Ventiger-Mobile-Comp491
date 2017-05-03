import {
	INIT_EVENT,
	UPDATE_EVENT,
	REGISTER_ME,
	NEW_TODO,
	TODO_TAKE
} from '../actions/types'

export default (state={}, action) => {
	switch (action.type) {
		case INIT_EVENT:
			return {
				...state,
				[action.data._id]: action.data
			}
		case UPDATE_EVENT:
			return {
				...state,
				[action._id]: {
					...state[action._id],
					...action.data
				}
			}
		case REGISTER_ME:
			return {
				...state,
				me: action.info
			}
		case NEW_TODO:
			const event = state[action._id]
			const todo = action.data
			const todos = event.todos.filter(t => t._id != todo._id)
			todos.push(todo)
			return {
				...state,
				[action._id]: {
					...state[action._id],
					todos
				}
			}
		default:
			return state
	}
}