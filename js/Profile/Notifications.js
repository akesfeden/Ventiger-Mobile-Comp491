import React, {Component} from "react";
import VIcon from "react-native-vector-icons/Ionicons";
import {compose, gql, graphql} from "react-apollo";
import loginCheck from "../login-check";
import UserCardItem from "./Components/UserCardItem";
import EventInvitationCardItem from "./Components/EventInvitationCardItem";
import {Button, Card, Col, Container, Content, ListItem, Text} from "native-base";
const strings = require('../strings').default.notifications
//console.log('strings', strings)
class Notifications extends Component {
    static navigationOptions = {
        title: strings.title,
        tabBar: {
            label: strings.label,
            icon: ({tintColor}) => (
                <VIcon name="ios-notifications" size={30} color={tintColor}/>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            friend: {
                accepted: {},
                rejected: {}
            },
            event: {
                accepted: {},
                rejected: {}
            }
        }
    }

    _getFriendRequests() {
        return this.props.data &&
            this.props.data.viewer &&
            this.props.data.viewer.friendRequests
    }

    _getEventRequests() {
        return this.props.data &&
            this.props.data.viewer &&
            this.props.data.viewer.eventInvitations
    }

    _setRequestState(requestType, responseType, _id) {
        this.setState({
            ...this.state,
            [requestType]: {
                ...this.state[requestType],
                [responseType]: {...this.state[requestType][responseType], [_id]: 1}
            }
        })
    }

    async _acceptFriend(_id) {
        await this.props.acceptFriend(_id)
        this._setRequestState('friend', 'accepted', _id);

    }

    async _rejectFriend(_id) {
        await this.props.rejectFriend(_id)
        this._setRequestState('friend', 'rejected', _id);
    }

    async _acceptEventInvitation(_id) {
        console.log("inv", await this.props.acceptEventInvitation(_id))
        this._setRequestState('event', 'accepted', _id);
    }

    async _rejectEventInvitation(_id) {
        await this.props.rejectEventInvitation(_id)
        this._setRequestState('event', 'rejected', _id);
    }

    _renderFriendRequests() {
        const friendRequests = this._getFriendRequests()
        if (!friendRequests) {
            return null
        }
        //console.log(friendRequests)
        return friendRequests
            .filter(friend => !this.state.friend.rejected[friend._id])
            .map((friend, i) => {
                let a = 'can'
                const lastSpace = friend.name.lastIndexOf(' ')
                let name, surname
                if (lastSpace == -1) {
                    name = friend.name
                } else {
                    name = friend.name.substring(0, lastSpace)
                    surname = friend.name.substring(lastSpace + 1, friend.name.length)
                }
                if (this.state.friend.accepted[friend._id]) {
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
                                <Col size={UserCardItem.contentSize / 2} style={{alignSelf: 'center'}}>
                                    <Button onPress={() => this.props.navigation.navigate('PersonCalendar', friend)}
                                            small>
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
                                (<Col size={UserCardItem.contentSize / 2} style={{alignSelf: 'center'}}>
                                    <Button onPress={() => this._acceptFriend(friend._id)} success small><Text>
                                        {strings.accept}
                                    </Text></Button>
                                </Col>),
                                (<Col size={UserCardItem.contentSize / 2} style={{alignSelf: 'center'}}>
                                    <Button onPress={() => this._rejectFriend(friend._id)} danger small><Text>
                                        {strings.reject}
                                    </Text></Button>
                                </Col>)]
                        }}
                        key={i}
                    />
                )
            })
    }

    _renderEventRequests() {
        const eventRequests = this._getEventRequests()
        if (!eventRequests) {
            return null
        }
        //console.log(eventRequests)
        return eventRequests
            .filter(event => !this.state.event.rejected[event._id])
            .map((event, i) => {
                return (
                    <EventInvitationCardItem
                        eventTitle={event.title}
                        eventLocation={event.location}
                        eventInviterInfo={event.invitor && event.invitor.name}
                        eventTime={event.time}
                        key={i}
                        renderButtons={
                            this.state.event.accepted[event._id]
                                ? () => (
                                <Col size={EventInvitationCardItem.contentSize / 2} style={{alignSelf: 'center'}}>
                                    <Button onPress={() => this.props.navigation.navigate('Event', event)}
                                            small>
                                        <Text>
                                            {strings.seeEvent}
                                        </Text>
                                    </Button>
                                </Col>
                            )
                                : () => ([
                                (<Col key={1} size={UserCardItem.contentSize / 2} style={{alignSelf: 'center'}}>
                                    <Button onPress={() => this._acceptEventInvitation(event._id)} success small>
                                        <Text>{strings.accept}</Text>
                                    </Button>
                                </Col>),
                                (<Col key={2} size={UserCardItem.contentSize / 2} style={{alignSelf: 'center'}}>
                                    <Button onPress={() => this._rejectEventInvitation(event._id)} danger small>
                                        <Text>{strings.reject}</Text>
                                    </Button>
                                </Col>)])
                        }
                        imageURL="https://img.tinychan.org/img/1360567490218199.jpg"
                    />)
            })
    }


    render() {
        const respondedRequestCount = [this.state.friend.accepted, this.state.friend.rejected, this.state.event.accepted, this.state.event.rejected]
            .map((obj) => Object.keys(obj).length)
            .reduce((acc, val) => acc + val, 0)
        if (respondedRequestCount == 0 && loginCheck()) {
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
                    <Card>
                        <ListItem itemDivider>
                            <Text>{strings.invitations}</Text>
                        </ListItem>
                        {this._renderEventRequests()}
                    </Card>
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
			 eventInvitations {
			    _id
                title
                invitor {
                    name
                }
            }
		}
	}
`
/*
* eventInvitations{
 _id
 title
 invitor{
 name
 }
 }
* */

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

const acceptEventInvitation = gql`
    mutation($eventId: ID!) {
		acceptEventInvitation(eventId: $eventId){
            _id
            title
            info
        }
	}
`

const rejectEventInvitation = gql`
	mutation($eventId: ID!) {
		rejectEventInvitation(eventId: $eventId)
	}
`

export default compose(
    graphql(getData),
    graphql(acceptFriend, {
        props: ({mutate}) => ({
            acceptFriend: (_id) => {
                console.log('update._id ', _id)
                mutate({
                    variables: {_id},
                })
            }
        })
    }),
    graphql(rejectFriend, {
        props: ({mutate}) => ({
            rejectFriend: (_id) => {
                console.log('reject._id ', _id)
                mutate({
                    variables: {_id}
                })
            }
        })
    }),
    graphql(acceptEventInvitation, {
        props: ({mutate}) => ({
            acceptEventInvitation: (eventId) => {
                console.log('update.eventId ', eventId)
                mutate({
                    variables: {eventId},
                })
            }
        })
    }),
    graphql(rejectEventInvitation, {
        props: ({mutate}) => ({
            rejectEventInvitation: (eventId) => {
                console.log('reject.eventId ', eventId)
                mutate({
                    variables: {eventId}
                })
            }
        })
    })
)(Notifications)


