import { AsyncStorage } from 'react-native'

const tokenName = 'mojo'

class TokenStore {
	static instance = null

	saveToken(token) {
		this.loggedIn = true
		AsyncStorage.setItem(tokenName, token)
	}

	async getToken() {
		if (!this.token) {
			try {
				this.token = await AsyncStorage.getItem(tokenName)
			} catch (e) {
				console.error(e)
				return null
			}
		}
		return this.token
	}

	removeToken() {
		this.token = null
		return AsyncStorage.removeItem(tokenName)
	}
}

export default function () {
	if (TokenStore.instance == null) {
		TokenStore.instance = new TokenStore()
	}
	return TokenStore.instance
}