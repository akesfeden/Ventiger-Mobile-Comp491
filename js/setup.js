import VentigerMobile from './VentigerMobile'

export default () => {
	window.navigator.userAgent = 'ReactNative'
	/*const io = require('socket.io-client')
	const socket = io('ws://localhost:3000', {
		transports: ['websocket'],
		forceNew: true
	})
	socket.emit('subscription', {
		query: `
		subscription ($eventId: ID!) {
			addTodoSub(eventId: $eventId) {
				_id
				description
				takersRequired
				creator {
					name
				}
			}
		}`,
		variables: {
			eventId: "Identity_Transformer_58f67e0ad7669812218af29b"
		}
	})

	socket.on('subscriptionChannels', (data) => {
		console.log('Channels ', data)
		Object.keys(data).forEach(cn => {
			socket.on(data[cn], res => {
				console.log("Subscription result ", res)
			})
		})
	})*/

	return VentigerMobile
}