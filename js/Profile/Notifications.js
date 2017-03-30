import React, { Component } from 'react'
import {  Image } from 'react-native'
import VIcon from 'react-native-vector-icons/Ionicons'
import { graphql, gql, compose } from 'react-apollo'
import loginCheck from '../login-check'
const strings = require('../strings').default.notifications
//console.log('strings', strings)

import { Container, ListItem, Text, Content,
	Col, Grid, Left, Right, Body, Card, CardItem
	, Icon, Button, Row } from 'native-base'

class Notifications extends Component {
	static navigationOptions = {
		title: "Notifications",
		tabBar: {
			label: "Notifications",
			icon: ({tintColor}) => (
				<VIcon name="ios-notifications" size={30} color={tintColor} />
			)
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			accepted: {},
			rejected: {}
		}
	}

	_getFriendRequests() {
		return this.props.data &&
			this.props.data.viewer &&
			this.props.data.viewer.friendRequests
	}

	async _acceptFriend(i) {
		const { _id } = this._getFriendRequests()[i]
		await this.props.acceptFriend(_id)
		this.setState({...this.state,
			accepted: {...this.state.accepted, [_id]: 1}})

	}

	async _rejectFriend(i) {
		const { _id } = this._getFriendRequests()[i]
		await this.props.rejectFriend(_id)
		this.setState({...this.state,
			rejected: {...this.state.rejected, [_id]: 1}})
	}

	_renderFriendRequests() {
		const friendRequests = this._getFriendRequests()
		if (!friendRequests) {
			return null
		}
		//console.log(friendRequests)
		return friendRequests
			.filter(friend => !this.state.rejected[friend._id])
			.map((friend, i) => {
				let a = 'can'
				const lastSpace = friend.name.lastIndexOf(' ')
				let name, surname
				if (lastSpace == -1) {
					name = friend.name
				} else {
					name = friend.name.substring(0, lastSpace)
					surname = friend.name.substring(lastSpace+1, friend.name.length)
				}
				if (this.state.accepted[friend._id]) {
					return (<CardItem key={i}>
						<Grid>
							<Col size={3}>
								<Image
									//source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
									source={{uri: 'https://img.tinychan.org/img/1360567490218199.jpg'}}
									style={{"width":50, "height":50, marginTop: 0,
											borderRadius: 25, alignSelf: 'center'}}
								/>

							</Col>
							<Col size={5} style={{alignSelf: 'center'}}>
								<Text>{name}</Text>
								<Text>{surname}</Text>
							</Col>
							<Col size={8} style={{alignSelf: 'center'}}>
								<Button onPress={()=>this.props.navigation.navigate('PersonCalendar', friend)} small><Text>
									{strings.seeProfile}
								</Text></Button>
							</Col>
						</Grid>
					</CardItem>
					)
				}
				return (
					<CardItem key={i}>
						<Grid>
							<Col size={3}>
								<Image
									//source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
									source={{uri: 'https://img.tinychan.org/img/1360567490218199.jpg'}}
									style={{"width":50, "height":50, marginTop: 0,
											borderRadius: 25, alignSelf: 'center'}}
								/>

							</Col>
							<Col size={5} style={{alignSelf: 'center'}}>
								<Text>{name}</Text>
								<Text>{surname}</Text>
							</Col>
							<Col size={4} style={{alignSelf: 'center'}}>
								<Button onPress={()=>this._acceptFriend(i)} success small><Text>
									{strings.accept}
								</Text></Button>
							</Col>
							<Col size={4} style={{alignSelf: 'center'}}>
								<Button onPress={() => this._rejectFriend(i)} danger small><Text>
									{strings.reject}
								</Text></Button>
							</Col>
						</Grid>
					</CardItem>
				)
			})
	}

	render(){
		if (Object.keys(this.state.accepted).length == 0 && Object.keys(this.state.accepted).length == 0 && loginCheck()) {
			this.props.data.refetch()
		}
		/*
		 <ListItem itemDivider><Text>Friend Requests</Text></ListItem>
		 {this._renderFriends()}
		* */
		return (
			<Container>
				<Content>
					<Card>
						<ListItem itemDivider>
							<Text>Friend Requests</Text>
						</ListItem>
						{this._renderFriendRequests()}
					</Card>

				</Content>
				<Content>
					<ListItem itemDivider>
						<Text>Event Invitations</Text>
					</ListItem>
				</Content>
			</Container>
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

//export default graphql(getData)(Notifications)

const acceptFriend = gql`
	mutation($_id: ID!) {
		acceptFriend(_id: $_id) {
			_id
			name
		}
	}
`

const rejectFriend = gql`
	mutation($_id: ID!) {
		rejectFriend(_id: $_id)
	}
`

export default compose(
	graphql(getData),
	graphql(acceptFriend, {
		props: ({mutate}) => ({
			acceptFriend: (_id) => {
				console.log('update._id ', _id)
				mutate({variables: {_id}})
			}
		})
	}),
	graphql(rejectFriend, {
		props: ({mutate}) => ({
			rejectFriend: (_id) => {
				console.log('reject._id ', _id)
				mutate({variables: {_id}})
			}
		})
	})
)(Notifications)


