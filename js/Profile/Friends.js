import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { graphql, gql } from 'react-apollo'
import { List, ListView, ListItem } from 'react-native-elements'
const Contacts = require('react-native-contacts')
import { Button, Container, Content, Card, Col, Text,ListItem as NListItem} from 'native-base'
import UserCardItem from './Components/UserCardItem'
import { connect } from 'react-redux'
import { registerContacts } from '../actions/profile-actions'
import loginCheck from '../login-check'


class Friends extends Component {
	static navigationOptions = {
		title: "Friends",
		tabBar: {
			label: "Friends",
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
					<UserCardItem
						renderContent={() => (
							<Text>{friend.name}</Text>
						)}
						onPress={() => this._onFriendSelect(i)}
						key={i}
						imageURL="https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
					/>
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

	_renderContacts() {
		if (this._getContacts()) {
			const contacts = this._getContacts()
			// TODO: add relation support
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
						<UserCardItem
							key={i}
							imageURL="https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
							renderContent={() => (
								<Text>{friend.name}</Text>
							)}
							renderButtons={() => (
									<Col
										size={UserCardItem.contentSize / 2}
										style={{alignSelf: 'center'}}
										>
										<Button small>
											<Text>Add Friend</Text>
										</Button>
									</Col>
								)
							}
							onPress={() => this._onContactSelect(i)}
						/>
					)
			})
		}
		return null
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
		/*
		 <List>
		 {this._renderFriends()}
		 </List>
		* */
		return (
			<Container>
				<Content>
					<Card>
						<NListItem header>
							<Text>Friends</Text>
						</NListItem>
						{this._renderFriends()}
					</Card>
				</Content>
				<Content>
					<Card>
						<NListItem header>
							<Text>Your contacts using Ventiger</Text>
						</NListItem>
						{this._renderContacts()}
					</Card>
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

const FriendsWithData = graphql(getData, {
	options: ({contacts}) => {
		return {
			variables: {
				phones: contacts
			}
		}
	}
})(Friends)

export default connect(
	(state) => ({ contacts: state.profile.contacts }),
	(dispatch) => ({
		loadContacts() {
			dispatch(registerContacts())
		},
	})
)(FriendsWithData)


