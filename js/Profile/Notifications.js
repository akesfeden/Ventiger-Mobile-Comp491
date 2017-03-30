import React, {Component} from "react";
import VIcon from "react-native-vector-icons/Ionicons";
import {compose, gql, graphql} from "react-apollo";
import loginCheck from "../login-check";
import UserCardItem from "./Components/UserCardItem";
import {Button, Card, Col, Container, Content, ListItem, Text} from "native-base";
const strings = require('../strings').default.notifications
//console.log('strings', strings)
const strings = require('../strings').default.notifications

class Notifications extends Component {
	static navigationOptions = {
        title: strings.title,
		tabBar: {
            label: strings.label,
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
					return (
						<UserCardItem
							renderContent={() => {
								return [
									(<Text>{name}</Text>),
									(<Text>{surname}</Text>)
								]
							}}
							key={i}
							renderButtons={() => (
								<Col size={UserCardItem.contentSize/2} style={{alignSelf: 'center'}}>
									<Button onPress={()=>this.props.navigation.navigate('PersonCalendar', friend)} small>
										<Text>
											{strings.seeProfile}
										</Text>
									</Button>
								</Col>
								)
							}
							imageURL="https://img.tinychan.org/img/1360567490218199.jpg"
						/>)
				}
				return (
					<UserCardItem
						renderContent={() => {
							return [
								(<Text>{name}</Text>),
								(<Text>{surname}</Text>)
							]
						}}
						imageURL="https://img.tinychan.org/img/1360567490218199.jpg"
						renderButtons={() => {
							return [
								(<Col size={UserCardItem.contentSize/2} style={{alignSelf: 'center'}}>
								<Button onPress={()=>this._acceptFriend(i)} success small><Text>
									{strings.accept}
								</Text></Button>
								</Col>),
							(<Col size={UserCardItem.contentSize/2} style={{alignSelf: 'center'}}>
								<Button onPress={() => this._rejectFriend(i)} danger small><Text>
									{strings.reject}
								</Text></Button>
							</Col>)]
						}}
						key={i}
					/>
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
						<ListItem header>
                            <Text>{strings.friendRequests}</Text>
						</ListItem>
						{this._renderFriendRequests()}
					</Card>

				</Content>
				<Content>
					<ListItem itemDivider>
                        <Text>{strings.invitations}</Text>
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


