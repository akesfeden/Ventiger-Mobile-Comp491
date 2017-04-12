import React, {Component} from "react";
import {Image, Text} from "react-native";
import {Button, Col, Grid, Row} from "react-native-elements";
import {compose, gql, graphql} from "react-apollo";
import Icon from "react-native-vector-icons/Ionicons";
import {Button as NButton} from 'native-base'
import isLoggedIn from "../login-check";
const strings = require('../strings').default.profile

export default class Event extends Component {
	static navigationOptions = {
		title: ({state}) => {
			//return 'Some Event'
			return state.params.title
		},
	}

	render() {
		return (
			<Grid>
				<Row size={2}>
					<Text>{this.props.navigation.state.params.title}</Text>
				</Row>
				<Row size={5} style={{ marginTop:5, backgroundColor: '#eaeeff'}}>

				</Row>
				<Row size={3} style={{ marginTop:0, backgroundColor: '#fff9c4'}}>

				</Row>
			</Grid>
		)
	}
}