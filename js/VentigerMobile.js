import React, { Component, PropTypes } from 'react'
import Navigator from './Navigator'
import client from './client'
import { ApolloProvider } from 'react-apollo'

import createStore from './store'
const store = createStore(client)

export default class VentigerMobile extends Component {
	render() {
		return (
			// TODO: change main scene based in persistence layer
			<ApolloProvider client={client} store={store}>
				<Navigator renderScene="Entry"/>
			</ApolloProvider>
		)
	}
}
