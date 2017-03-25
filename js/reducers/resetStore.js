import {LOGOUT} from '../actions/types'
export default (state, action) => {
	if (action.type === LOGOUT) {
		return {}
	}
	return state
}