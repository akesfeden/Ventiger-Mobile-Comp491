import ApolloClient, { createNetworkInterface, toIdValue } from 'apollo-client'

// TODO: refactor api address
const apiAddress = "http://localhost:8001/api/graphql"

function dataIdFromObject(result) {
	if (result._id && result.__typename) {
		return result.__typename + '/' + result._id
	}

	if (result._id && !result.__typename) {
		return result._id
	}

	return null
}

const client = new ApolloClient({
	networkInterface: createNetworkInterface({
		uri: apiAddress
	}),
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