import React, {Component, PropTypes} from "react";
import {Image} from "react-native";
import {CardItem, Col, Grid, Row, Text} from "native-base";
const strings = require('../../strings').default.notifications


export default class EventCardItem extends Component {
    static contentSize = 8
    rowStyle = {marginTop: 5, marginBottom: 5}


    render() {
        return (
            <CardItem onPress={this.props.onPress} style={{...this.props.styles}}>
                <Grid>
                    <Col size={3}>
                        <Image
                            //source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
                            source={{uri: this.props.imageURL}}
                            style={{
                                "width": 120, "height": 120, marginTop: 0,
                                borderRadius: 60, alignSelf: 'center'
                            }}
                        />

                    </Col>
                    <Col size={5} style={{alignSelf: 'center'}}>
                        <Row style={this.rowStyle}>
                            <Text>{this.props.eventTitle}</Text>
                        </Row>
                        <Row style={this.rowStyle}>
                            <Col>

                                {this.props.eventLocation ?
                                    [
                                        (<Row key="EventLocationRow1">
                                            <Text>{strings.eventLocationLabel}</Text>
                                        </Row>),
                                        (<Row key="EventLocationRow2">
                                            <Text>{this.props.eventLocation.info}</Text>
                                        </Row>)
                                    ]
                                    : null
                                }
                            </Col>
                            <Col>

                                {this.props.eventTime ?
                                    [
                                        (<Row key="EventTimeRow1">
                                            <Text>{strings.eventTimeLabel}</Text>
                                        </Row>),
                                        (<Row key="EventTimeRow2">
                                            <Text>{this.props.eventTime.startTime}-{this.props.eventTime.endTime}</Text>
                                        </Row>)]
                                    : null
                                }

                            </Col>
                        </Row>
                    </Col>
                </Grid>
            </CardItem>
        )
    }
}

EventCardItem.propTypes = {
    onPress: PropTypes.func,
    imageURL: PropTypes.string,
    eventTitle: PropTypes.string,
    eventLocation: PropTypes.shape({
        info: PropTypes.string
    }),
    eventTime: PropTypes.shape({
        startTime: PropTypes.string,
        endTime: PropTypes.string
    }),
    eventInviterInfo: PropTypes.string
}