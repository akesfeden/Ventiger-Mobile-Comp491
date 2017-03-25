import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { graphql, gql } from 'react-apollo'
import { Button } from 'react-native-elements'

class Friends extends Component {
	static navigationOptions = {
		title: "Friends",
		tabBar: {
			label: "Friends",
			icon: ({tintColor}) => (
				<Icon name="ios-people" size={30} color={tintColor} />
			)
		}
	}

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this._loadContacts()

	}

	_getNumRequests() {
		const reqs = this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.friendRequests
		if (Array.isArray(reqs)) {
			return reqs.length()
		}
		return 0
	}

	render() {
		return (
			<Button
				icon={{name: 'ios-person'}}
				buttonStyle={{
					marginTop: 0, marginLeft: 15,
					marginRight: 15, paddingBottom: 7,
					paddingTop: 5,
					backgroundColor: '#8bcbff'
				}}
				title={this._getNumRequests()}
			/>
		)
	}
}

const getData = gql`
	query {
		viewer {		
			friendRequests {
				_id
				name
			}
		}
	}
`

export default graphql(getData)(Friends)