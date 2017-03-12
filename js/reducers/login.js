import { LOGIN, LOGOUT } from '../actions/types'

export default function (state={}, action) {
	switch (action.type) {
		case LOGIN:
		case LOGOUT:
			return {
				isLoggedIn: action.isLoggedIn
			}
		default:
			return state
	}
}