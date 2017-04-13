import React, {Component} from "react";
import {Image, Text, ListView, ListItem} from "react-native";
import {Button, Col, Grid, Row, Card} from "react-native-elements";
import {compose, gql, graphql} from "react-apollo";
import Icon from "react-native-vector-icons/Ionicons";
import {Button as NButton} from 'native-base'
import isLoggedIn from "../login-check";
const strings = require('../strings').default.profile

class Calendar extends Component {
	static navigationOptions = {
		title:
		({state}) => {
			return (state.params && state.params.name)
				|| strings.calendar
		},
		tabBar: {
			label: strings.calendar,
			icon: (args) => {
				console.log('icon args', args)
				const { tintColor } = args
				return (
					<Icon name="ios-calendar"
						  size={30}
						  color={tintColor}
					/>
				)
			}
		},
	}

	_settings() {
		const { navigate } = this.props.navigation
		navigate('Settings')
	}

	_renderProfile() {
		if (this.props.loading) {
			return <Text>{strings.loading + '...'}</Text>
		}
		if (this.props.profile) {
			return (<Text>{this.props.profile.name}</Text>)
		}
		return null
	}

	_renderSettingsButton() {
		if (!this.props.relation) {
			return null
		}
		switch (this.props.relation) {
			case "MYSELF":
				return (
					<Button
                        icon={{name: 'edit'}}
                        buttonStyle={{
								marginTop: 0, marginLeft: 15,
								marginRight: 15, paddingBottom: 7,
								paddingTop: 5,
								backgroundColor: '#5f93ff'
						}}
                        title={strings.editProfile}
                        onPress={this._settings.bind(this)}
					/>
				)
			case "FRIEND":
				return (
					<Button
                        icon={{name: 'settings'}}
                        buttonStyle={{
							marginTop: 0, marginLeft: 15,
							marginRight: 15, paddingBottom: 7,
							paddingTop: 5,
							backgroundColor: '#a804ff'
						}}
                        title={strings.friendshipSettings}
                        onPress={() => {
							this.props.navigation.navigate('FriendshipSettings', this.props.profile)
						}}
					/>
				)
			// TODO: Add request sent
			default:
				return (
					<Button
                        icon={{name: 'add'}}
                        buttonStyle={{
							marginTop: 0, marginLeft: 15,
							marginRight: 15, paddingBottom: 7,
							paddingTop: 5,
							backgroundColor: '#4dc37a'
						}}
                        title={strings.sendFriendRequest}
                        onPress={() => this.props.addFriend({_id: this.props.profile._id})}
					/>
				)
		}
	}

	_renderCalendar() {
		if (this.props.relation) {
			switch (this.props.relation) {
				case 'MYSELF':
				case 'FRIEND':
					return (
						<Row size={8} style={{ marginTop:5, backgroundColor: '#eaeeff'}}></Row>
					)
			}
		}
		return null
	}

	_onCreateEvent() {
		this.props.navigation.navigate('EventCreation')
	}

	_renderCreateEventButton() {
		if (this.props.relation && this.props.relation === 'MYSELF') {
			return (<Button icon={{name:'add'}} title={strings.newEvent}
							onPress={this._onCreateEvent.bind(this)}
							buttonStyle={{
										marginTop: 5, marginLeft: 0,
										marginRight: 0, paddingBottom: 3,
										paddingTop: 3,
										backgroundColor: '#3cae73',
								}}/>
			)
		}
		return null
	}

	render() {
		console.log(isLoggedIn())
		if (isLoggedIn()) {
			console.log('refetched...')
			this.props.refetch()
		}
		return (
			<Grid>
				<Row size={2}>
					<Col size={1}>
						<Image
							//source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
							source={{uri: 'https://img.tinychan.org/img/1360567490218199.jpg'}}
							style={{"width":100, "height":100, marginTop: 10,
							 borderRadius: 50, alignSelf: 'center'}}
						/>
					</Col>
					<Col size={2} >
							<Text style=
									  {{paddingBottom: 7, fontSize: 20,
									  textAlign: 'center', paddingTop: 20
									  }}>
								{this._renderProfile()}
							</Text>
							{this._renderSettingsButton()}
					</Col>

				</Row>
				<Row size={5} style={{ marginTop:5, backgroundColor: '#eaeeff'}}>
					<Row size={1}>
						<Col size={4}>
						</Col>
						<Col size={2}>
							{this._renderCreateEventButton()}
						</Col>
					</Row>
				</Row>
				<Row size={2} style={{ marginTop:0, backgroundColor: '#fff9c4'}}>

				</Row>
			</Grid>
		)
	}
}
//<Text>Today</Text>

//TODO: reconsider when having nested relation
const getProfile = gql`
	query ($_id:ID){
		viewer {
			profile(_id:$_id){
				name
				_id
			}
			relation(_id: $_id)
		}
	}
`

const addFriend = gql`
	mutation($_id:ID!) {
		addFriend(_id:$_id)
	}
`

const CalendarWithData = compose(
	graphql(getProfile, {
			options: ({navigation}) => ({
				variables: {
					_id: (
					(navigation
						&& navigation.state
						&& navigation.state.params
						&& navigation.state.params._id
					) || null)
				}
			}),
			props: ({ownProps, data: {loading, viewer, refetch}}) => {
				console.log(viewer)
				return {
					loading,
					profile: viewer && viewer.profile,
					relation: viewer && viewer.relation,
					refetch
				}
			}
		}
	),
	graphql(addFriend, {
		props: ({mutate}) => ({
			addFriend: ({_id}) => {
				console.log("mutate ", _id)
				mutate({variables: {_id}})
			}
		})
	})
)(Calendar)

export default CalendarWithData