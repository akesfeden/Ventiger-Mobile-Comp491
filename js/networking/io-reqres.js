/**
 * API request response module using socket.io
 * */
import socket from './socket'

export default (query, variables) => {
	const reqId = String(Date.now()) + String(Math.random()).substring(0,5)
	const reqBody = {
		id: reqId,
		query,
		variables
	}
	socket.io.emit('query', reqBody)
	return new Promise(function (resolve, reject) {
		let resolved = false
		socket.io.on('result/'+reqId, res => {
			resolve(res)
			resolved = true
		})
		setTimeout(
			()=>!resolved && reject({message: 'Request Timeout'}),
			5000
		)
	})
}