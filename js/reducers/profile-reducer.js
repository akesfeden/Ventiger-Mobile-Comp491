import { CONTACTS } from '../actions/types'
export default (state={}, action) => {
	if (action.type === CONTACTS) {
		console.log('action ', action)
		return {...state, contacts:action.phoneNumbers}
	}
	return state
}