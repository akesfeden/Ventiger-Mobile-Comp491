import {
	REGISTER_NAME,
	REGISTER_PHONE,
	REGISTER_PASSWORD,
	REMOVE_REGISTER,
	UNSET_PASSWORD,
	SET_ID,
	COMPLETE
} from '../actions/types'

// TODO: Switch-Case :)
export default function registration (state={}, action) {
	if (action.type === REGISTER_PHONE ||
		action.type === REGISTER_NAME ||
		action.type === REGISTER_PASSWORD ||
		action.type === SET_ID
	) {
		return {
			...state,
			...action.data
		}
	}
	if (action.type === REMOVE_REGISTER) {
		return {}
	}
	if (action.type === UNSET_PASSWORD) {
		const newState = {}
		Object.keys(state).forEach(key => {
			if (key !== 'password') {
				newState[key] = state[key]
			}
		})
		return newState
	}
	if (action.type === COMPLETE) {
		return {
			...action.data
		}
	}
	return state
}