import React, {Component} from "react";
import client from "./client";
import {ApolloProvider} from "react-apollo";
import createStore from "./store";
import MainScreen from "./MainScreen";

let store = createStore(client)
export default class VentigerMobile extends Component {

	render() {
		return (
			<ApolloProvider client={client} store={store}>
				<MainScreen />
			</ApolloProvider>
		)
	}
}


