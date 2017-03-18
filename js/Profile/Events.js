import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
const strings = require('../strings').default.profile
import Icon from 'react-native-vector-icons/Ionicons';

export default class Events extends Component {
	static navigationOptions = {
		title: "Events",
		tabBar: {
			label: "Events",
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

	render() {
		return null
	}
}