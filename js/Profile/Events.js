import React, {Component} from "react";
import Icon from "react-native-vector-icons/Ionicons";
const strings = require('../strings').default.events

export default class Events extends Component {
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

	render() {
		return null
	}
}