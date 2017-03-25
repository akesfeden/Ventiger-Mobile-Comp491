import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { graphql, gql } from 'react-apollo'
import { List, ListView, ListItem, ButtonGroup } from 'react-native-elements'
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
		this.state = {
			_selectedIndex: 0
		}
	}

	componentDidMount() {
		this._loadContacts()

	}

	_loadContacts() {
		Contacts.getAll((err, contacts) => {
			if (err) {
				console.error(err)
				return
			}
			console.log('contacts ', contacts)
			let phoneNumbers = []
			contacts.forEach(c => {
				console.log('number', c.phoneNumbers)
				phoneNumbers = phoneNumbers.concat(c.phoneNumbers)
			})
			phoneNumbers = phoneNumbers
				.map(number => number.number.replace(/\D/g,''))
			console.log(phoneNumbers)
			//console.log(phoneNumbers.replace(/\D/g,''))
			/*const phoneNumbers = contacts
				.map(contact => contact.phoneNumbers)
				.reduceRight((coll, item) => coll.concat(item))
			/*({
					name: contact.givenName + " " + contact.familyName,
					phoneNumbers: contact.phoneNumbers
				}))*/
				//.reduce((c1, c2) => console.log(c1, c2) )
				//.reduce((x, y) => x.concat(y))
			//console.log('phone numbers', phoneNumbers)

		})
	}

	_getFriends() {
		return this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.friends
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
			const friends = this.props.data.viewer.friends
			return friends.map((friend, i) => {
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

	/*_updateIndex(selectedIndex) {
		this.setState({...this.state, selectedIndex})
	}

	_getOptions() {
		return [
			{element: () => <Text>Friends</Text>},
			{element: () => <Text>Contacts</Text>}
		]
	}*/

	render() {
		console.log('friends', this.props.data)
		//const { navigate } = this.props.navigation
		/*<ButtonGroup
		 onPress={this._updateIndex.bind(this)}
		 selectedIndex={this.state._selectedIndex}
		 buttons={this._getOptions()}
		 containerStyle={{height: 30}}
		 />*/
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

/*
 ($phones: [String])
 contacts (phones: $phones) {
 	name
 	_id
 }
* */
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

export default graphql(getData)(Friends)
/*const PhoneWithData = graphql(phoneCheck, {
	options: ({phone}) => {
		//console.log('phone', phone)
		return {
			variables: {phone: (phone ? phone : "")}
		}
	}
})(PhoneRegistration)

export default graphql(getContacts, {
	options: ({contacts}) => {
		return {
			variables: {phone: (phone ? phone : "")}
		}
	}
})(Friends)*/

