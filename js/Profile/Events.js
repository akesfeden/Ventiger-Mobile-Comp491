import React, {Component} from "react"
import Icon from "react-native-vector-icons/Ionicons"
import {Button, Card, Icon as NIcon, Col, Container, Content, ListItem, Text, Grid, Row, Left, Right, Title, Body, H3, CardItem} from "native-base";
import {gql, graphql} from 'react-apollo'
const strings = require('../strings').default.events
import {Image} from "react-native"
import {Button as EButton} from 'react-native-elements'
import loginCheck from "../login-check";

//TODO: pagination for timed events
class Events extends Component {
	static navigationOptions = {
        title: strings.title,
		tabBar: {
            label: strings.label,
			icon: (args) => {
				//console.log('icon args', args)
				const { tintColor } = args
				return (
					<Icon name="ios-wine"
						  size={30}
						  color={tintColor}
					/>
				)
			}
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			dateOffset:0
		}
		this.numRefetch = 0
	}

	_getToday() {
		return new Date()
	}

	_getCurrentDay() {
		const today = this._getToday()
		today.setDate(today.getDate()+this.state.dateOffset)
		return today
	}

	_onNext() {
		this.setState({...this.state, dateOffset: this.state.dateOffset+1})
	}

	_onPrev() {
		this.setState({...this.state, dateOffset: this.state.dateOffset-1})
	}

	_onHome() {
		this.setState({...this.state, dateOffset: 0})
	}

	_getEvents() {
		return (
			this.props.data &&
			this.props.data.viewer &&
			this.props.data.viewer.events
		)
	}

	_renderTimedEvents() {
		if (!this._getEvents()) {
			return null
		}
		console.log("Events ", this._getEvents())
		const formattedEventTime = event => {
			const startTime = new Date(event.time.startTime)
			const endTime = new Date(event.time.endTime)
			return startTime.toTimeString().substring(0,5) + ' - ' + endTime.toTimeString().substring(0, 5)
		}
		const isInCurrentDay = time_ => {
			const currentDay = new Date(this._getCurrentDay())
			const time = new Date(time_)
			return time.getDate() == currentDay.getDate() && time.getMonth() == currentDay.getMonth() && time.getYear() == currentDay.getYear()
		}
		return this._getEvents()
			.filter(e=>e.time && (isInCurrentDay(e.time.startTime) || isInCurrentDay(e.time.endTime)))
			.sort((e1, e2) => e1.time.startTime > e2.time.startTime)
			// TODO: internationalize
			.map(e => {
					let desc = ""
					let cnt = 0
					e.participants.forEach(p=>{
						if (cnt < 3) {
							cnt++
							desc += (desc === "") ? p.name : (", " + p.name)
						}
					})
					if (cnt == 3 && e.participants.length>3) {
						desc += " and " + Math.max((e.participants.length-3), 0) + " others"
					}
					//desc = "Participants: " + desc
					return (
						<Card>
							<CardItem  onPress={() => {
							this.props.navigation.navigate('Event', e)
						}}>
								<Col size={1} >
									<Image
										source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}

										style={{"width":50, "height":50, marginTop: 0,
											borderRadius: 15, alignSelf: 'center'}}
									/>
								</Col>
								<Col size={3} style={{alignSelf: 'center'}}>
									<Title>{e.title + " (" + formattedEventTime(e)+")"}</Title>
									<Text>{desc}</Text>
								</Col>
							</CardItem>
						</Card>
					)
				}
			)
	}

	_renderUntimedEvents() {
		if (!this._getEvents()) {
			return null
		}
		console.log("Events ", this._getEvents())
		return this._getEvents()
			.filter(e=>!e.time)
			// TODO: internationalize
			.map(e => {
				let desc = ""
				let cnt = 0
				e.participants.forEach(p=>{
					if (cnt < 3) {
						cnt++
						desc += (desc === "") ? p.name : (", " + p.name)
					}
				})
				if (cnt == 3 && e.participants.length>3) {
					desc += " and " + Math.max((e.participants.length-3), 0) + " others"
				}
				//desc = "Participants: " + desc
				return (
					<Card>
						<CardItem  onPress={() => {
							this.props.navigation.navigate('Event', e)
						}}>
							<Col size={1} >
							<Image
								source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}

								style={{"width":50, "height":50, marginTop: 0,
											borderRadius: 15, alignSelf: 'center'}}
							/>
							</Col>
							<Col size={3} style={{alignSelf: 'center'}}>
								<Title>{e.title}</Title>
								<Text>{desc}</Text>
							</Col>
						</CardItem>
					</Card>
				)
			}
		)
	}

	componentWillReceiveProps(nextProps) {
		console.log('Props ', nextProps)
	}

	render() {
		if (loginCheck() && this.numRefetch == 0) {
			this.props.data && this.props.data.refetch()
			this.numRefetch++
		}

		return (
			<Container>
				<Grid>
					<Row size={2}>
						<Card style={{marginBottom:0, paddingBottom:0}}>
							<CardItem>
								<Left>
									<Button small warning onPress={this._onPrev.bind(this)}>
										<Icon name='ios-arrow-back'/>
									</Button>

								</Left>
								<Text style={{marginRight:10}}>
									{this.state.dateOffset == 0 && `Today(${this._getCurrentDay().toDateString()})` || this._getCurrentDay().toDateString()}
								</Text>
								<Button small onPress={this._onHome.bind(this)}>
									<NIcon name='home'/>
								</Button>
								<Right>
									<Button small success onPress={this._onNext.bind(this)}>
										<Icon name='ios-arrow-forward'/>
									</Button>
								</Right>
							</CardItem>
						</Card>
					</Row>
					<Row size={8}>
						<Content style={{marginTop:0, paddingTop:0}}>
							{this._renderTimedEvents()}
						</Content>
					</Row>
					<Row size={2}>
						<Card style={{marginTop:20}}>
							{/*style={{backgroundColor:"#f9f2f7"}}*/}
							<CardItem itemDivider>
								<Title>Time is Undetermined</Title>
							</CardItem>
						</Card>
					</Row>
					<Row size={5}>
						<Content>
							{this._renderUntimedEvents()}
						</Content>
					</Row>
					<Row size={2}>
						<Content >
							{/*TODO: Try to add this to top*/}
							<EButton
								buttonStyle={{backgroundColor: "#32c2ee", marginTop:5,marginRight:0, marginLeft:0}}
								title="Create New Event"
								icon={{name: 'add'}}
								onPress={() => {
									this.props.navigation.navigate('EventCreation')
								}}
							/>
						</Content>
					</Row>
				</Grid>
			</Container>
		)
	}
}

const getData = gql`
	query {
		viewer {
			events {
				_id
				title
				time {
					startTime
					endTime
				}
				participants {
					_id
					name
				}
			}
		}
	}
`

export default graphql(getData)(Events)

