import React, {Component, PropTypes} from "react";
import {Image} from "react-native";
import {CardItem, Col, Grid, Row, Text} from "native-base";
const strings = require('../../strings').default.notifications


export default class EventInvitationCardItem extends Component {
    static contentSize = 8
    rowStyle = {marginTop: 5, marginBottom: 5}

    _renderButtons() {
        if (this.props.renderButtons) {
            return this.props.renderButtons()
        }
        return null
    }

    render() {
        console.log('Event Card Item Title', this.props.eventTitle)
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
                                <Row>
                                    <Text>{strings.eventLocationLabel}</Text>
                                </Row>
                                <Row>
                                    <Text>{this.props.eventLocation || strings.evenUnknownField}</Text>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Text>{strings.eventTimeLabel}</Text>
                                </Row>
                                <Row>
                                    <Text>{this.props.eventTime || strings.evenUnknownField}</Text>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={this.rowStyle}>
                            <Text>{strings.eventInviterLabel}{this.props.eventInviterInfo}</Text>
                        </Row>
                        <Row style={this.rowStyle}>
                            {this._renderButtons()}
                        </Row>
                    </Col>
                </Grid>
            </CardItem>
        )
    }
}

EventInvitationCardItem.propTypes = {
    renderButtons: PropTypes.func,
    onPress: PropTypes.func,
    imageURL: PropTypes.string,
    eventTitle: PropTypes.string,
    eventLocation: PropTypes.string,
    eventTime: PropTypes.string,
    eventInviterInfo: PropTypes.string
}