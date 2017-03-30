import React, { Component } from 'react'
import { View, Text, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
const strings = require('../strings').default.profile
import { graphql, gql } from 'react-apollo'


class FriendshipSettings extends Component {
	static navigationOptions = {
		title:
			({state}) => {
			console.log('State', state)
				return (state.params && state.params.name)
			}
	}

	constructor(props) {
		super(props)
	}

	_removeFriend() {
		console.log("Remove Friend ", this.props.navigation.state.params._id)
		const { _id } = this.props.navigation.state.params
		this.props.removeFriend(_id)

	}

	render() {
		return (
			<View>
				<Button
					title={strings.unfriend}
					iconRight
					onPress={this._removeFriend.bind(this)}
					buttonStyle={{backgroundColor: '#ff4b48', marginTop:10}}
				/>
			</View>
		)
	}

}

const removeFriend = gql`
	mutation ($_id: ID!) {
		removeFriend(_id: $_id)
	}
`


export default graphql(removeFriend, {
	props: ({mutate}) => ({
		removeFriend: (_id) => {
			console.log('update._id ', _id)
			mutate({variables: {_id}})
		}
	})
})(FriendshipSettings)