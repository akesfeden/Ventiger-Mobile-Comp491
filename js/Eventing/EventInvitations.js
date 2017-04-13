import React, {Component} from "react";
import {List} from "react-native";
import {Button, Col, Container, Content, Icon as LIcon, List as NList, ListItem as NListItem, Text} from "native-base";
import UserCardItem from "../Profile/Components/UserCardItem"
import loginCheck from "../login-check";
const strings = require('../strings').default.friends
import { Button as EButton } from 'react-native-elements'
import { NavigationActions }from 'react-navigation'

export default class EventInvitations extends Component {
	/*static navigationOptions = {
		title: "Select Friends" //FIXME: hc
	}*/

	constructor(props) {
		super(props)
		this.state = {
			inviteds: {}
		}
	}

	_getFriends() {
		return this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.friends
	}

	_onFriendSelect(i) {
		const friends = this._getFriends()
		if (friends) {
			const selectionData = friends[i]
			const { navigate } = this.props.navigation
			navigate('PersonCalendar', selectionData)
		}
	}

	_onAdd(_id) {
		this.setState({...this.state, inviteds: {...this.state.inviteds, [_id]: 1}})
	}

	_onRemove(_id) {
		this.setState({...this.state, inviteds: {...this.state.inviteds, [_id]: 0}})
	}

	_renderButton(_id, inviteds=false) {
		if (inviteds) {
			return (
				<Button small danger
					onPress={() => this._onRemove(_id)}>
					<LIcon name="ios-remove"/>
				</Button>
			)
		}
		return (
			<Button small
				 onPress={() => this._onAdd(_id)}>
				<LIcon name="add"/>
			</Button>
		)
	}

	_renderFriends(inviteds=false) {
		//console.log('data', this.props.data)
		if (this._getFriends()) {
			const friends = this._getFriends()
			return friends
				.filter(friend=>(inviteds ? this.state.inviteds[friend._id]: !this.state.inviteds[friend._id]))
				.map((friend, i) => {
				return (
					<NListItem style={{marginLeft: 0, paddingLeft:0, paddingRight:0, paddingTop:0, paddingBottom:0}}>
						<UserCardItem
							renderContent={() => (
								<Text>{friend.name}</Text>
							)}
							renderButtons={() => (
									<Col
										size={UserCardItem.contentSize / 4}
										style={{alignSelf: 'center'}}>
										{this._renderButton(friend._id, inviteds)}
									</Col>
								)
							}
							onPress={() => this._onFriendSelect(i)}
							key={i}
							imageURL="https://img.tinychan.org/img/1360567490218199.jpg"
						/>
					</NListItem>
				)
			})
		}
		return null
	}

	_renderInvitedsTitle() {
		if (Object.keys(this.state.inviteds)
				.filter(key => this.state.inviteds[key]).length > 0) {
			return (
				<NListItem>
					<Text>Inviteds</Text>
				</NListItem>
			)
		}
		return null
	}

	_navigate(params) {
		//this.props.navigation.navigate('Event', params)
		const navigationAction = NavigationActions.reset({
			index: 1,
			actions: [
				NavigationActions.navigate({ routeName: 'Profile'}),
				NavigationActions.navigate({ routeName: 'Event', params })
			]
		})
		this.props.navigation.dispatch(navigationAction)
	}

	_onComplete() {
		const { title, location } = this.props.eventInfo//this.props.navigation.state.params
		this.props.mutate({variables: {
			body: {
				title,
				location: location ? {
						info: location
					} : null,
			},
			userIds: Object.keys(this.state.inviteds)
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

	render() {
		if (loginCheck()) {
			this.props.data.refetch()
		}
		return (
			<Container>
				<Content>
					<NList>
						{this._renderInvitedsTitle()}
						{this._renderFriends(true)}
						<NListItem>
							<Text>Friends</Text>
						</NListItem>
						{this._renderFriends()}
					</NList>
				</Content>
				<EButton
					buttonStyle={{marginBottom:10, backgroundColor: '#c38c3b'}}
					icon={{name: 'arrow-back'}}
					title="Back to editing"
					onPress={this.props.goBack}
				/>
				<EButton
					buttonStyle={{marginBottom:10, backgroundColor: '#53c35f'}}
					title="Complete"
					onPress={this._onComplete.bind(this)}
				/>
			</Container>
		)
	}
}
