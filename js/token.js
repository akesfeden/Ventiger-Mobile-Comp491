import { AsyncStorage } from 'react-native'

const tokenName = 'mojo'
const expiryDateName = 'maho'

class TokenStore {
	static instance = null

	saveToken(token, daysToExpiry) {
		this.loggedIn = true
		const expiryTime = new Date()
		const OFFSET = 1
		expiryTime.setDate(expiryTime.getDate() + daysToExpiry - OFFSET)
		AsyncStorage.setItem(tokenName, token)
		AsyncStorage.setItem(expiryDateName, expiryTime)
	}

	async getToken() {
		if (!this._expiryTime) {
			try {
				this._expiryTime = await AsyncStorage.getItem(expiryDateName)
				this._expiryTime = new Date(this._expiryTime)
			} catch (e) {
                console.warn(e)
				return null
			}
		}
		//console.log("Expiry time ", this._expiryTime < (new Date()).)
		if (this._expiryTime < new Date()) {
			this.removeToken()
		}
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