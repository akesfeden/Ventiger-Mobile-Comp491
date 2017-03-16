import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'


export default class Friends extends Component {
	static navigationOptions = {
		title: "Friends",
		tabBar: {
			label: "Friends",
			icon: ({tintColor}) => (
				<Image
					source={require('./children-icon.png')}
					style={{height: 30, width: 35, tintColor: tintColor}}
				/>
			)
		}
	}

	render() {
		//const { navigate } = this.props.navigation
		return null
	}
}