import React, {Component} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {Card, CardItem, Col, Container, Content, Grid, Row, Text} from "native-base";
import {Image} from "react-native";

const strings = require('../strings').default.events


//TODO: pagination for timed events
export class SearchResults extends Component {
    static navigationOptions = {
        title: strings.title,
        tabBarLabel: strings.label,
        tabBarIcon: (args) => {
            //console.log('icon args', args)
            const {tintColor} = args
            return (
                <Icon name="ios-wine"
                      size={30}
                      color={tintColor}
                />
            )
        }
    }


    _getEvents() {
        try {
            return this.props.navigation.state.params.events
        } catch (err) {
            return []
        }

    }

    _renderSingleEvent(e, key, formattedEventTimeFunc) {
        let desc = ""
        let cnt = 0
        e.participants.forEach(p => {
            console.log("Event participant", p, formattedEventTimeFunc)
            if (cnt < 3 && p) {
                cnt++
                desc += (desc === "") ? p.name : (", " + p.name)
            }
        })
        if (cnt == 3 && e.participants.length > 3) {
            desc += " and " + Math.max((e.participants.length - 3), 0) + " others"
        }
        //desc = "Participants: " + desc
        return (
            <Card key={key}>
                <CardItem onPress={() => {
                    this.props.navigation.navigate('Event', e)
                }}>
                    <Col size={1}>
                        <Image
                            source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}

                            style={{
                                "width": 50, "height": 50, marginTop: 0,
                                borderRadius: 15, alignSelf: 'center'
                            }}
                        />
                    </Col>
                    <Col size={3} style={{alignSelf: 'center'}}>
                        <Text>{e.title +
                        (formattedEventTimeFunc ?
                            " (" + formattedEventTimeFunc(e) + ")"
                            : "")}
                        </Text>
                        <Text>{desc}</Text>
                    </Col>
                </CardItem>
            </Card>
        )
    }

    _renderTimedEvents() {
        if (!this._getEvents()) {
            return null
        }
        console.log("AEvents ", this._getEvents())
        const formattedEventTime = event => {
            const startTime = new Date(event.time.startTime)
            const endTime = new Date(event.time.endTime)
            return startTime.toTimeString().substring(0, 5) + ' - ' + endTime.toTimeString().substring(0, 5)
        }
        const isInCurrentDay = time_ => {
            const currentDay = new Date(this._getCurrentDay())
            const time = new Date(time_)
            return time.getDate() == currentDay.getDate() && time.getMonth() == currentDay.getMonth() && time.getYear() == currentDay.getYear()
        }
        return this._getEvents()
            .filter(e => e.time && (isInCurrentDay(e.time.startTime) || isInCurrentDay(e.time.endTime)))
            .sort((e1, e2) => e1.time.startTime > e2.time.startTime)
            // TODO: internationalize
            .map((e, i) => this._renderSingleEvent(e, i, formattedEventTime))
    }

    _renderUntimedEvents() {
        if (!this._getEvents()) {
            return null
        }
        console.log("Events ", this._getEvents())
        return this._getEvents()
            .filter(e => !e.time)
            // TODO: internationalize
            .map((e, i) => this._renderSingleEvent(e, i))
    }

    render() {
        console.log('AEVENTS', this.props)

        return (
            <Container>
                <Grid>
                    <Row size={8}>
                        <Content style={{marginTop: 0, paddingTop: 0}}>
                            {this._renderTimedEvents()}
                            {this._renderUntimedEvents()}
                        </Content>
                    </Row>
                </Grid>
            </Container>
        )
    }
}
