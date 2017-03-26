import ApolloClient, { createNetworkInterface, toIdValue } from 'apollo-client'
import token from './token'
// TODO: refactor api address
const apiAddress = "http://localhost:3000/api/graphql"

function dataIdFromObject(result) {
	if (result._id && result.__typename) {
		return result.__typename + '/' + result._id
	}

	if (result._id && !result.__typename) {
		return result._id
	}
	// console.log('result', result)
	return null
}

const networkInterface = createNetworkInterface({uri: apiAddress})
networkInterface.use([{
	async applyMiddleware(req, next) {
		if (!req.options.headers) {
			req.options.headers = {}
		}
		req.options.headers['Authorization'] = await token().getToken()
		next()
	}}
])

const client = new ApolloClient({
	networkInterface,
	addTypename: true,
	dataIdFromObject: dataIdFromObject,
	/*customResolvers: {
	 Mutation: {
	 login: (_, args) => toIdValue(dataIdFromObject({
	 _id: (args.body.phone || args.body.email)
	 }))
	 }
	 }*/
})

export default client