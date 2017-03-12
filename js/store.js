import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
//import ApolloClient from 'apollo-client';
import registrationReducer from './reducers/registration'
import promiseMiddleware from 'redux-promise'
import loginReducer from  './reducers/login'

//const client = new ApolloClient();
export default function (client) {
	return createStore(
		combineReducers({
			login: loginReducer,
			registration: registrationReducer,
			apollo: client.reducer(),
		}),
		{}, // initial state
		compose(
			applyMiddleware(
				client.middleware(),
				promiseMiddleware
			)
			// If you are using the devToolsExtension, you can add it here also
			//(typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
		)
	)
}


//export default store