const io = require('socket.io-client');

class Socket {
	static instance = null;
	constructor() {
		if (Socket.instance != null) {
			throw Error('Singleton!')
		}
		this.io = io('ws://localhost:3000', {
			transports: ['websocket'],
			forceNew: true
		})
	}
}

export default (() => {
	if (Socket.instance == null) {
		Socket.instance = new Socket()
	}
	return Socket.instance
})()