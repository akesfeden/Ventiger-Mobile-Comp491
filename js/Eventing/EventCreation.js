import React, {Component} from "react";
import {Button, FormInput, FormLabel} from "react-native-elements";
import {View} from "react-native";
/*import {gql, graphql} from "react-apollo";
import {NavigationActions} from "react-navigation";*/
const strings = require('../strings').default.events
import EventInvitations from './EventInvitations'
import {compose, gql, graphql} from "react-apollo";
import { NavigationActions } from 'react-navigation'
import DropDown, {
	Select,
	Option,
	OptionList
} from 'react-native-selectme'
import TimeSelect from './EventTimeSelector'

class EventCreation extends Component {
	static navigationOptions = {
		title: strings.eventCreation,
	}

	constructor(props) {
		super(props)
		this.state = {}
		// TODO: internationalization
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
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
		//this._navigate(this.state)
		this.setState({...this.state, clicked: true})
	}

	_isButtonDisabled() {
		return !(this.state.title && this.state.title.length > 0)
	}

	_onComplete() {
		const { title, location } = this.state//this.props.navigation.state.params
		this.props.mutate({variables: {
			body: {
				title,
				location: location ? {
					info: location
				} : null,
			}
		}}).then(res => {
			if (res.data.createEvent) {
				console.log('Success...', res.data.createEvent)
				this._navigate(res.data.createEvent)
			} else {
				console.log('Fail...')
			}
		}).catch(err => {
			console.error(err)
		})
	}

	_getOptionList() {
		return this.refs['OPTIONLIST'];
	}

	//TODO: internatiolize
	_onTimeSelect() {
		this.setState({
			...this.state,
			selectingTime: true
		})
	}

	render() {
		// FIXME: hc
		if (this.state.clicked) {
			return (
				<EventInvitations
					eventInfo={this.state}
					navigation={this.props.navigation}
					data={this.props.data}
					mutate={this.props.mutate}
					goBack={() => this.setState({...this.state, clicked: false})}
				/>
			)
		}
		if (this.state.selectingTime) {
			return (
				<TimeSelect onCancel={()=>this.setState({
					...this.state, selectingTime: false
				})}/>
			)
		}
		return (
			<View>
				<FormLabel >Event Title</FormLabel>
				<FormInput onChangeText={this._onTitleChange.bind(this)} value={this.state.title}/>
				<FormLabel>Event Location</FormLabel>
				<FormInput onChangeText={this._onLocationChange.bind(this)} value={this.state.location}/>
				<Button
					buttonStyle={{marginTop:10, backgroundColor: '#47c0c3'}}
					title={"Select Time"}
					onPress={this._onTimeSelect.bind(this)}
				/>
                <Button title="Invite Friends"
                        buttonStyle={{marginTop:10, backgroundColor: '#53c35f'}}
						onPress={this._onEventCreate.bind(this)}
						disabled={this._isButtonDisabled()}
				/>
				<Button title="Complete"
						buttonStyle={{marginTop:10, backgroundColor: '#5990c3'}}
						disabled={this._isButtonDisabled()}
						onPress={this._onComplete.bind(this)}
				/>

			</View>
		)
	}
}

const getData = gql`
	query {
		viewer {	
			friends(sortedBy: "name") {
				_id
				name
			}
		}
	}
`

const createEventMutation = gql`
mutation ($body: EventBody!, $userIds: [ID]) {
	createEvent(body: $body, userIds: $userIds) {
		_id
		title
	}
}`

export default compose(
	graphql(createEventMutation),
	graphql(getData)
)(EventCreation)