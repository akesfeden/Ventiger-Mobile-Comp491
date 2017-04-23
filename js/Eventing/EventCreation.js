import React, {Component} from "react";
import {Button, FormInput, FormLabel, Text} from "react-native-elements";
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
		title: strings.eventCreation
	}

	constructor(props) {
		super(props)
		this.state = {inviteds: []}
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
		const { title, location, inviteds, time } = this.state//this.props.navigation.state.params
		this.props.mutate({variables: {
			body: {
				title,
				location: location ? {
					info: location
				} : null,
				time: time || null
			},
			userIds: inviteds,
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

	//TODO: internatiolize
	_onTimeSelect() {
		this.setState({
			...this.state,
			selectingTime: true
		})
	}

	_renderTime() {
		if (this.state.time) {
			console.log('time ', this.state.time)
			const {startTime, endTime} = this.state.time
			console.log('Start time ', startTime,toString())
			console.log('End time ', endTime.toString())
			// TODO: high level display
			return <Text style={{alignSelf:'center'}}>{ startTime.toLocaleString() + " - " + endTime.toLocaleString()}</Text>
		}
		return null
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
					goBack={(inviteds) => this.setState({...this.state, clicked: false, inviteds})}
				/>
			)
		}
		if (this.state.selectingTime) {
			return (
				<TimeSelect
					onCancel={()=>this.setState({
						...this.state, selectingTime: false
					})}
					onDone={(startTime, endTime)=>this.setState({
						...this.state, selectingTime: false, time: {startTime, endTime}
					})}
				/>
			)
		}
		//TODO: display invited friends
		return (
			<View>
				<FormLabel >Event Title</FormLabel>
				<FormInput onChangeText={this._onTitleChange.bind(this)} value={this.state.title}/>
				<FormLabel>Event Location</FormLabel>
				<FormInput onChangeText={this._onLocationChange.bind(this)} value={this.state.location}/>
				<FormLabel>Event Time</FormLabel>
				{this._renderTime()}
				<Button
					icon={{name:'edit'}}
					buttonStyle={{marginTop:10, backgroundColor: '#47c0c3'}}
					title={"Edit Time"}
					onPress={this._onTimeSelect.bind(this)}
				/>
                <Button title="Invite Friends"
						icon={{name:"insert-invitation"}}
                        buttonStyle={{marginTop:10, backgroundColor: '#5990c3'}}
						onPress={this._onEventCreate.bind(this)}
						disabled={this._isButtonDisabled()}
				/>
				<Button title="Complete"
						buttonStyle={{marginTop:10, backgroundColor: '#53c35f'}}
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