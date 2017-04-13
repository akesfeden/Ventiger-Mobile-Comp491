import React, {Component} from "react";
import {List} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {compose, gql, graphql} from "react-apollo";
import {Button, Col, Container, Content, Icon as LIcon, List as NList, ListItem as NListItem, Text} from "native-base";
import UserCardItem from "./Components/UserCardItem";
import {connect} from "react-redux";
import {registerContacts} from "../actions/profile-actions";
import loginCheck from "../login-check";
//import { List, ListView, ListItem } from 'react-native-elements'
const Contacts = require('react-native-contacts')
const strings = require('../strings').default.friends
const demo = false

class Friends extends Component {
	static navigationOptions = {
        title: strings.title,
		tabBar: {
            label: strings.label,
			icon: ({tintColor}) => (
				<Icon name="ios-people" size={30} color={tintColor} />
			)
		}
	}

	constructor(props) {
		super(props)
		console.log(this.props)
		this.state = {
			_selectedIndex: 0
		}
		this.numRefetch = 0
	}

	componentDidMount() {

	}

	componentWillMount() {
		this.props.loadContacts()
	}

	_getFriends() {
		return this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.friends
	}

	_getContacts() {
		return this.props.data
		 	&& this.props.data.viewer
			&& this.props.data.viewer.contacts
	}

	_onFriendSelect(i) {
		console.log('here')
		const friends = this._getFriends()
		if (friends) {
			const selectionData = friends[i]
			const { navigate } = this.props.navigation
			console.log(this.props.navigation)
			navigate('PersonCalendar', selectionData)
		}
	}

	_renderFriends() {
		//console.log('data', this.props.data)
		if (this._getFriends()) {
			const friends = this._getFriends()

			return friends.map((friend, i) => {
				return (

                    <NListItem key={i}
                               style={{
                                   marginLeft: 0,
                                   paddingLeft: 0,
                                   paddingRight: 0,
                                   paddingTop: 0,
                                   paddingBottom: 0
                               }}>
						<UserCardItem
							renderContent={() => (
								<Text>{friend.name}</Text>
							)}
							onPress={() => this._onFriendSelect(i)}

							imageURL="https://img.tinychan.org/img/1360567490218199.jpg"
						/>
					</NListItem>
				)
				/*return (

					<ListItem
						roundAvatar
						avatar={{uri:"https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
						key={i}
						title={friend.name}
						onPress={() => this._onFriendSelect(i)}
						style={{marginBottom: 10}}
					/>

				)*/
			})
		}
		return null
	}

	_onContactSelect(i) {
		const contact = this._getContacts()[i]
		this.props.navigation.navigate('PersonCalendar',
			contact)
	}

	_onAddFriend(i) {
		const contact = this._getContacts()[i]
		console.log('friend addition ', contact, i)
		this.props.addFriend(contact._id)
		if (demo) {
			this.props.data.refetch()
			/*const contacts  = this._getContacts()
			const usr = contacts.find(usr => usr._id === contact._id)
			usr.relation = 'REQUESTER'*/

		}
	}

	_renderContacts() {
		if (this._getContacts()) {
			const contacts = this._getContacts()
			// TODO: add relation support
			console.log(contacts)
			return contacts
				.map((friend, i) => {
				/*return (
					<ListItem
						roundAvatar
						avatar={{uri:"https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
						key={i}
						title={friend.name +  "(" + friend.relation + ")"}
						style={{marginBottom: 10}}
						onPress={() => this._onContactSelect(i)}
					/>
				)*/
					return (
                        <NListItem key={this._getFriends().length + i + 1}
                                   style={{
                                       marginLeft: 0,
                                       paddingLeft: 0,
                                       paddingRight: 0,
                                       paddingTop: 0,
                                       paddingBottom: 0
                                   }}>
							<UserCardItem

                                imageURL="https://img.tinychan.org/img/1360567490218199.jpg"
								renderContent={() => (
									<Text>{friend.name}</Text>
								)}
								renderButtons={() => (
										<Col
											size={2 * UserCardItem.contentSize / 3}
											style={{alignSelf: 'center'}}
											>
											{this._renderContactButton(i)}
										</Col>
									)
								}
								onPress={() => this._onContactSelect(i)}
							/>
						</NListItem>
					)
			})
		}
		return null
	}

	_renderContactButton(i) {
		const contact = this._getContacts()[i]
		switch (contact.relation) {
			case 'REQUESTED':
				return (
					<Button
						small
						success>
						<Text>View in Requests</Text>
					</Button>
				)
			case 'REQUESTER':
				return (
					<Button
						small
						warning
						onPress={() => {
							this.props.cancelFriend(contact._id)
							if (demo) {
								this.props.data.refetch()
							}
						}}
					>
						<Text>Cancel Request</Text>
					</Button>
				)
			default:
				return (<Button small
					onPress={() => this._onAddFriend(i)}
					>
					<LIcon name="add"/>
					<Text>Add Friend</Text>
				</Button>
				)
		}
	}

	render() {
		//this.props.data.refetch()
		/*if (this.numRefetch == 0) {
			console.log('.....\nMounted\n.....')
			this.props.data.refetch()
			this.numRefetch++
		}*/
		console.log("Friends data", this.props.data)
		console.log("my contacts: ", this.props.contacts)
		if (loginCheck()) {
			this.props.data.refetch()
		}
		return (
			<Container>
				<Content>
					<NList>
						{this._renderFriends()}
						<NListItem>
							<Text>Your contacts</Text>
						</NListItem>
						{this._renderContacts()}
					</NList>
				</Content>
			</Container>
		)
	}
}

const getData = gql`
	query ($phones: [String]!){
		viewer {	
			friends(sortedBy: "name") {
				_id
				name
			}
			contacts(phones: $phones) {
				_id
				name
				relation
			}
		}
	}
`

const addFriend = gql`
	mutation($_id:ID!) {
		addFriend(_id:$_id)
	}
`

const rejectFriend = gql`
	mutation($_id: ID!) {
		rejectFriend(_id: $_id)
	}
`


const cancelFriend = gql`
	mutation($_id: ID!) {
		cancelFriendRequest(_id: $_id)
	}
`


const FriendsWithData = compose(
	graphql(getData, {
		options: ({contacts}) => {
			/*if (!contacts) {
				console.warn('Contacts are not loaded')
				contacts = []
			}*/
			return {
				variables: {
					phones: contacts
				}
			}
		},
		skip: props => !props.contacts
	}),
	graphql(addFriend, {
		props: ({mutate}) => ({
			addFriend: (_id) => {
				console.log("mutate ", _id)
				mutate({variables: {_id}})
			}
		})
	}),
	graphql(cancelFriend, {
		props: ({mutate}) => ({
			cancelFriend: (_id) => {
				console.log("cancelFriend ", _id)
				mutate({variables: {_id}})
			}
		})
	}),
)(Friends)


export default connect(
	(state) => ({ contacts: state.profile.contacts }),
	(dispatch) => ({
		loadContacts() {
			dispatch(registerContacts())
		},
	})
)(FriendsWithData)


