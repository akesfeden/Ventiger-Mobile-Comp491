import React, { Component } from 'react'
import { View, Text, TextInput } from 'react-native'
//import Button from 'react-native-button'
//import { NavigationActions } from 'react-navigation'
import { logout as logoutAction } from '../actions/login-actions'
import { connect } from 'react-redux'
import { graphql, gql, compose } from 'react-apollo'
//import { Button, Container, Text, Content, Icon } from 'native-base'
import { Button, List, ListItem } from 'react-native-elements'
const strings = require('../strings').default.profile
import Icons from 'react-native-vector-icons/EvilIcons'
import styles from '../Registration/styles'

class Settings extends Component {
	static navigationOptions = {
		title: strings.settings
	}

	constructor(props) {
		super(props)
		//console.log(Icons)
		this.state = {
			name: "",
			oldPassword: "",
			newPassword: ""
		}
	}

	_logout() {
		this.props.logout()
		this.props.reset()
		//global.destroyEverything()
	}

	render() {
		return (
			<View>
				<List>
					<ListItem
						title="Edit Personal Info"
						leftIcon={{name: 'info'}}
						onPress={
							() => this.props.navigation.navigate('NameSettings')}
					/>
					<ListItem
						title="Change Password"
						leftIcon={{name: 'fingerprint'}}
						onPress={
							() => this.props.navigation.navigate('PasswordSettings')
						}
					/>
				</List>
				<Button
					title={strings.logout}
					iconRight
					onPress={this._logout.bind(this)}
					buttonStyle={{backgroundColor: '#ff4b48', marginTop:10}}
					//icon={{name: 'delete'}}
				/>
			</View>
		)
		// TODO: Edit the defaultValue
		/*<Text>Name: </Text>
		 <TextInput defaultValue ={
		 this.props
		 && this.props.data
		 && this.props.data.viewer
		 && this.props.data.viewer.profile
		 && this.props.data.viewer.profile.name}
		 style={{height: 30, paddingLeft:5, marginBottom: 5}}
		 onChangeText={(text) => this.setState({...this.state, name: text})}
		 />*/
		/*return (
			<View style={{marginTop:10}}>
				<Text>Name: </Text>
				<TextInput
					defaultValue={
						this.props
						&& this.props.data
						&& this.props.data.viewer
						&& this.props.data.viewer.profile
						&& this.props.data.viewer.profile.name}
					style={{height: 25, marginTop:3, backgroundColor: 'white'}}
					onChangeText={(text) => this.setState({...this.state, name: text})}
				/>
				<Button>

				</Button>
				<Button
					containerStyle={
						{backgroundColor: 'orange', height: 25,
						marginTop:10, marginLeft:20, marginRight:20}}
					style={{color: 'white'}}
					onPress={this._updateInfo.bind(this)}
				>
					Update Info
				</Button>
				<Text style={{marginTop: 20}}>Change Your Password:</Text>
				<TextInput
					style={{height: 25, marginTop:5, backgroundColor: 'white'}}
					secureTextEntry={true}
					placeholder="Old Password"
					onChangeText={(text) =>
						this.setState({...this.state, oldPassword: text})
					}
				/>
				<TextInput
					style={{height: 25, marginTop:10, backgroundColor: 'white'}}
					secureTextEntry={true}
					placeholder="New Password"
					onChangeText={(text) =>
						this.setState({...this.state, newPassword: text})
					}
				/>
				<Button
					containerStyle={
						{backgroundColor: 'orange', height: 25,
						marginTop:10, marginLeft:20, marginRight:20}}
					style={{color: 'white'}}
					onPress={this._changePassword.bind(this)}
				>
					Change Password
				</Button>

				<Button
					onPress={this._logout.bind(this)}
					containerStyle={
						{backgroundColor: 'red', height: 25,
						marginTop:25, marginLeft:20, marginRight:20}}
					style={{color: 'black'}}
				>
					{strings.logout}
				</Button>
			</View>
		)*/
	}
}



// ($oldPassword: String!, $newPassword: String!) {


/*const SettingsWithInfoData = compose(
	// Connection to online state
	graphql(getInfo),
	graphql(updateInfo, {
		props: ({mutate}) => ({
			updateInfo: (info) => {
				console.log(info)
				mutate({variables: {info}})
			}
		})
	})
)(Settings)*/

//const SettingsWithPasswordChange = graphql(changePassword)(SettingsWithInfoData)

export default connect(
	(state) => ({ name: state.login }),
	(dispatch) => ({
		logout() {
			dispatch(logoutAction())
		},
		reset() {
			//dispatch({type: 'APOLLO_STORE_RESET'})
		}
	})
)(Settings)