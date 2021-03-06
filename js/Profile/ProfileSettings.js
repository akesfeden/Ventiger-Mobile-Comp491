import React, {Component} from "react";
import {Text, TextInput, View} from "react-native";
import {Button} from "react-native-elements";
import styles from "../Login/styles";
import {compose, gql, graphql} from "react-apollo";
import loginCheck from "../login-check";
const strings = require('../strings').default.profileSettings

class ProfileSettings extends Component {

	constructor(props) {
		super(props)
		this.state = {
			nameEdited: 0,
			name: ''
		}
	}
	//_send
	_updateInfo() {
		this.props.updateInfo({
			name: this.state.name
		})
	}

	_renderSuccess() {
		try {
			console.log('render ', this.state.name, this.props.data.viewer.profile.name)
			if ((this.state.name === this.props.data.viewer.profile.name) && this.state.nameEdited &&
				(this.state.name !== this.state.initName || (this.nameEdited > 2))) {
				//this.setState({...this.state, nameEdited:0})
				return (<Text style={{marginLeft:10}}>Succeed...</Text>)
			}
		} catch (err) {
			console.log(err)
			return null
		}
		return null
	}

	_getProfileData() {
		return this.props
			&& this.props.data
			&& this.props.data.viewer
			&& this.props.data.viewer.profile
			&& this.props.data.viewer.profile.name
	}

	_storeInitial() {
		this.setState({...this.state, initName: this._getProfileData()})
	}

	render() {
		console.log(this.state.nameEdited)
		if (loginCheck()) {
			this.props.data.refetch()
		}
		return (
			<View>
				<TextInput
					placeholder={strings.namePlaceholder}
					onChangeText={(text) => this.setState({...this.state, name: text, nameEdited:this.state.nameEdited+1})}
					style={styles.textInput}
					autoFocus={true}
					autoCapitalize={'words'}
					defaultValue={this._getProfileData()}
					onFocus={this._storeInitial.bind(this)}
				/>
				{this._renderSuccess()}
				<Button
					title={strings.updatePlaceholder}
					buttonStyle={{backgroundColor: '#0fac0e', marginTop:10}}
					onPress={this._updateInfo.bind(this)}
					disabled={this.state.nameEdited === 0}
				/>
			</View>
		)
	}
}

const getInfo = gql`
	query {
		viewer {
			profile {
				_id
				name
			}
		}
	}
`
const updateInfo = gql`
	mutation ($info: ProfileEdit!){
		changeProfileInfo(info: $info) {
			_id
			name
		}
	}
`

export default compose(
	// Connection to online state
	graphql(getInfo),
	graphql(updateInfo, {
		props: ({mutate}) => ({
			updateInfo: (info) => {
				console.log('info', info)
				mutate({variables: {info}})
			}
		})
	})
)(ProfileSettings)



