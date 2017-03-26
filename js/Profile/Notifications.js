import React, { Component } from 'react'
import {  Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { graphql, gql, compose } from 'react-apollo'

import { Container, ListItem, Text, Content,
	Col, Grid, Thumbnail, Left, Right, Body } from 'native-base'

class Notifications extends Component {
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

	_renderFriendButtons(i) {
		const { _id } = this._getFriendRequests()[i]
		console.log(this._getFriendRequests())
		if (this.state.accepted[_id]) {
			return [(<Col size={1}>
					<Text
						style={{color:'white', backgroundColor:'blue'}}
						onPress={
							() => this.props.navigation.navigate('PersonCalendar', {_id})
						}
					>
						See profile
					</Text>
				</Col>)]
		}
		return [(<Col size={1} tyle={{backgroundColor:'green', marginRight:2}}>
			<Text onPress={() => this._acceptFriend(i)} style={{color:'white', backgroundColor:'green'}}>Accept</Text>
		</Col>), (<Col size={1}>
			<Text onPress={() => this._rejectFriend(i)} style={{color:'white', backgroundColor:'red'}}>Reject</Text>
		</Col>)]
	}

	//TODO: see profile bug fix
	_renderFriends() {

		if (this._getFriendRequests()) {
			const friendRequests = this._getFriendRequests()
			return friendRequests
				.filter(friend => !this.state.rejected[friend._id])
				.map((friend, i) => {
				return (<ListItem avatar key={i}>
						<Left>
							<Image
								//source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
								source={{uri: 'https://img.tinychan.org/img/1360567490218199.jpg'}}
								style={{"width":50, "height":50, marginTop: 5,
							 borderRadius: 25, alignSelf: 'center'}}
							/>
						</Left>
						<Body>
						<Grid>
							<Col size={2}><Text>{friend.name}</Text></Col>
							{this._renderFriendButtons(i)}
						</Grid>
						</Body>
					</ListItem>
				)
			})
		}
	}

	render(){
		//this.props.data.refetch()
		return (
			<Container>
				<Content>
					<ListItem itemDivider><Text>Friend Requests</Text></ListItem>
						{this._renderFriends()}
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
