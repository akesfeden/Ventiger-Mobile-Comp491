import React, {Component} from "react";
import {Button, FormInput, FormLabel} from "react-native-elements";
import {View} from "react-native";
import {gql, graphql} from "react-apollo";
import {NavigationActions} from "react-navigation";
const strings = require('../strings').default.events

class EventCreation extends Component {
	static navigationOptions = {
		title: strings.eventCreation,
	}

	constructor(props) {
		super(props)
		this.state = {datePicking:false}

	}

	_navigate(params) {
		const navigationAction = NavigationActions.reset({
			index: 1,
			actions: [
				NavigationActions.navigate({ routeName: 'Profile'}),
				NavigationActions.navigate({ routeName: 'Event', params })
			]
		})
		this.props.navigation.dispatch(navigationAction)
	}

	_onTitleChange(text) {
		this.setState({...this.state, title: text})
	}

	_onLocationChange(text) {
		this.setState({...this.state, location: text})
	}

	_onEventCreate() {
		console.log("Mutation state", this.state)
		this.props.mutate({variables: {
			body: {
				title: this.state.title,
				location: {
					info: this.state.location
				}
			}
		}}).then(res => {
			if (res.data.createEvent) {
				console.log('Success...', res.data.createEvent)
				//this.props.navigation.navigate('Event', res.data.createEvent)
				this._navigate(res.data.createEvent)
			} else {
				console.log('Fail...')
			}
		}).catch(err => {
			console.error(err)
		})
	}

	render() {
		return (
			<View>
				<FormLabel >Event Title</FormLabel>
				<FormInput onChangeText={this._onTitleChange.bind(this)}/>
				<FormLabel>Event Location</FormLabel>
				<FormInput onChangeText={this._onLocationChange.bind(this)}/>
                <Button title={strings.createEvent}
                        buttonStyle={{marginTop:10}}
                        onPress={this._onEventCreate.bind(this)}
				/>
			</View>
		)
	}
}


const createEventMutation = gql`
mutation ($body: EventBody!) {
	createEvent(body: $body) {
		_id
		title
	}
}`

export default graphql(createEventMutation)(EventCreation)