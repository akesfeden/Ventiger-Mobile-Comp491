import React, {Component} from "react"
import Icon from "react-native-vector-icons/Ionicons"
import {Button, Card, Icon as NIcon, Col, Container, Content, ListItem, Text, Grid, Row, Left, Right, Title, Body, H3, CardItem} from "native-base";
import {gql, graphql} from 'react-apollo'
const strings = require('../strings').default.events
import {Image} from "react-native"

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

	_getEvents() {
		try {
			return this.props.data.viewer.events
		} catch (err) {
			return []
		}
	}

	_renderUntimedEvents() {
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
				if (cnt == 3 && e.participants.length>2) {
					desc += " and " + Math.max((e.participants.length-2), 0) + " others"
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

	render() {
		return (
			<Container>
				<Grid>
					<Row size={2}>
						<Card style={{marginBottom:0, paddingBottom:0}}>
							<CardItem>
								<Left>
									<Button small warning>
										<Icon name='ios-arrow-back'/>
									</Button>

								</Left>
								<Text style={{marginRight:20}}>
									24 Haziran 2017
								</Text>
								<Button small>
									<NIcon name='home'/>
								</Button>
								<Right>

									<Button small success>
										<Icon name='ios-arrow-forward'/>
									</Button>
								</Right>
							</CardItem>
						</Card>
					</Row>
					<Row size={8}>
						<Content style={{marginTop:0, paddingTop:0}}>
							<Card>

							</Card>
						</Content>
					</Row>
					<Row size={2}>
						<Card style={{backgroundColor:"#f9f2f7"}}>
							<CardItem itemDivider style={{backgroundColor:"#f9f2f7"}}>
								<Title>Time is Undetermined</Title>
							</CardItem>
						</Card>
					</Row>
					<Row size={7}>
						<Content>
							{this._renderUntimedEvents()}
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

