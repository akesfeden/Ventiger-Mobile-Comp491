import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { graphql, gql } from 'react-apollo'
import { List, ListView, ListItem } from 'react-native-elements'
const Contacts = require('react-native-contacts')
import { NavigationActions } from 'react-navigation'

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
	}

	componentDidMount() {
		this._loadContacts()

	}

	_getFriendRequests() {
		return this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.friendRequests
	}

	_onFriendSelect(i) {
		console.log('here')
		/*const friends = this._getFriendRequests()
		if (friends) {
			const selectionData = friends[i]
			const { navigate } = this.props.navigation
			console.log(this.props.navigation)
			navigate('PersonCalendar', selectionData)
		}*/
	}

	_renderFriends() {
		//console.log('data', this.props.data)
		if (this._getFriendRequests()) {
			const friendRequests = this._getFriendRequests()
			console.log(friendRequests)
			return friendRequests.map((friend, i) => {
				return (
					<ListItem
						roundAvatar
						avatar={{uri:"https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"}}
						key={i}
						title={friend.name}
						onPress={() => this._onFriendSelect(i)}
					/>
				)
			})
		}
		return null
	}

	render() {
		return (
			<View>
				<List>
					{this._renderFriends()}
				</List>
				<Text>
					Other stuff
				</Text>
			</View>
		)
	}
}

const getData = gql`
	query {
		viewer {		
			friendRequests {
				_id
				name
			}
		}
	}
`

export default graphql(getData)(Friends)