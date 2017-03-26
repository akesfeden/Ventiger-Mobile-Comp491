import { CONTACTS } from './types'
const Contacts = require('react-native-contacts')

//TODO: handle error
export function registerContacts () {
	return dispatch => {
		return Contacts.getAll((err, contacts) => {
			if (err) {
				console.error(err)
				return
			}
			console.log('contacts ', contacts)
			let phoneNumbers = []
			contacts.forEach(c => {
				console.log('number', c.phoneNumbers)
				phoneNumbers = phoneNumbers.concat(c.phoneNumbers)
			})
			phoneNumbers = phoneNumbers
				.map(number => number.number.replace(/\D/g,''))
			dispatch({
				type: CONTACTS,
				phoneNumbers
			})
		})
	}
}