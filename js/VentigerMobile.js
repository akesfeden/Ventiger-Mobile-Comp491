import React, { Component, PropTypes } from 'react'
import Navigator from './Navigator'
import client from './client'
import { ApolloProvider } from 'react-apollo'
import createStore from './store'
import token from './token'
import MainScreen from './MainScreen'
import getAccess from './store-access'

let store = createStore(client)
let accessor = getAccess()
accessor.store = store

export default class VentigerMobile extends Component {

	render() {
		return (
			<ApolloProvider client={client} store={store}>
				<MainScreen />
			</ApolloProvider>
		)
	}
}


