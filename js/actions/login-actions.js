import token from '../token'
import { LOGIN, LOGOUT } from './types'

export async function loginCheck() {
	const something = await token().getToken()
	return {
		type: LOGIN,
		isLoggedIn: Boolean(something)
	}
}

export async function logout() {
	let isLoggedIn = null
	try {
		await token().removeToken()
		isLoggedIn = false
	} catch (e) {
		console.error(e)
	}
	return {
		type: LOGOUT,
		isLoggedIn
	}
}