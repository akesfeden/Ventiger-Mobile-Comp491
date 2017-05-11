import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
//import ApolloClient from 'apollo-client';
import registrationReducer from "./reducers/registration";
import promiseMiddleware from "redux-promise";
import loginReducer from "./reducers/login";
import thunk from "redux-thunk";
import profileReducer from "./reducers/profile-reducer";
import searchReducer from "./reducers/search-reducer";

//const client = new ApolloClient();
export default function (client) {
	return createStore(
		combineReducers({
			login: loginReducer,
			registration: registrationReducer,
			profile: profileReducer,
			apollo: client.reducer(),
            search: searchReducer
		}),
		{}, // initial state
		//compose(
			applyMiddleware(
				client.middleware(),
				promiseMiddleware,
				thunk,
				logger()
			)
			// If you are using the devToolsExtension, you can add it here also
			//(typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
		//)
	)
}


//export default store