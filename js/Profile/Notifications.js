import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { graphql, gql } from 'react-apollo'
import { List, ListView, ListItem } from 'react-native-elements'
const Contacts = require('react-native-contacts')
import { NavigationActions } from 'react-navigation'

class Friends extends Component {
	static navigationOptions = {
		title: "Notifications",
		tabBar: {
			label: "Notifications",
			icon: ({tintColor}) => (
				<Icon name="ios-notifications" size={30} color={tintColor} />
			)
		}
	}

	constructor(props) {
		super(props)
	}

	_getFriendRequests() {
		return this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.friendRequests
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
					/>
				)
			})
		}
		return null
	}

	render() {
		this.props.data.refetch()
		return (
			<View>
				<List horizontal={true}>
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