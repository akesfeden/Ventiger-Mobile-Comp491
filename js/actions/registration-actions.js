import {
	REGISTER_PHONE,
	REGISTER_NAME,
	REGISTER_PASSWORD,
	REMOVE_REGISTER,
	UNSET_PASSWORD,
	SET_ID,
	COMPLETE
} from './types'

export function registerPhone(phone) {
	return {
		type: REGISTER_PHONE,
		data: { phone }
	}
}

export function registerPassword(password) {
	return {
		type: REGISTER_PASSWORD,
		data: { password }
	}
}

export function registerName(name) {
	return {
		type: REGISTER_NAME,
		data: { name }
	}
}

export function removeRegistration() {
	return {
		type: REMOVE_REGISTER,
	}
}

export function unsetPassword() {
	return {
		type: UNSET_PASSWORD
	}
}

export function setId(_id) {
	return {
		type: SET_ID,
		data: {_id}
	}
}

export function completeRegistration(authInfo) {
	return {
		type: COMPLETE,
		data: authInfo
	}
}