import React, { Component, PropTypes } from 'react'
import Navigator from './Navigator'
import client from './client'
import { ApolloProvider } from 'react-apollo'
import createStore from './store'
import token from './token'
import MainScreen from './MainScreen'

const store = createStore(client)

export default class VentigerMobile extends Component {

	render() {
		return (
			// TODO: change main scene based on persistence layer
			<ApolloProvider client={client} store={store}>
				<MainScreen/>
			</ApolloProvider>
		)
	}
}


