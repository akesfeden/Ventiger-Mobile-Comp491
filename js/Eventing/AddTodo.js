import React, {Component} from "react"
import { View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import {Button, FormInput, FormLabel, Text} from "react-native-elements"

export default class AddTodo extends Component {
	static navigationOptions = {
		title: 'New Todo'
	}

	constructor(props) {
		super(props)
		this.state = {
			takersRequired: 1
		}
	}

	render() {
		return (
			<View>
				<FormLabel>Description</FormLabel>
				<FormInput onChangeText={text => this.setState({...this.state, description: text})}/>
				<FormLabel>Takers Required</FormLabel>
				<FormInput value={String(this.state.takersRequired)}
						   onChangeText={text => this.setState({...this.state, takersRequired: Number(text.replace(/\D/g,''))})}/>
				<Button
					buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#52c36d'}}
					title='Done'
					onPress={async () => {
						const success = await this.props.navigation.state.params.dispatcher.addTodo(this.state)
						if (success) {
							this.props.navigation.dispatch(NavigationActions.back())
						}
					}}
					disabled={!Boolean(this.state.description)}
				/>
			</View>
		)
	}
}