import React, {Component, PropTypes} from 'react'
import {
	View,
	TextInput
} from 'react-native'
import { Button } from 'react-native-elements'
import styles from '../Login/styles'
import { graphql, gql, compose } from 'react-apollo'

class ProfileSettings extends Component {

	constructor(props) {
		super(props)
		this.state = {
			nameEdited: false,
			name: ''
		}
	}
	//_send
	_updateInfo() {
		//if(this.props.data.loading) {
			this.props.updateInfo({
				name: this.state.name
			})
		//}
	}

	render() {
		return (
			<View>
				<TextInput
					placeholder='Name'
					onChangeText={(text) => this.setState({...this.state, name: text, nameEdited:true})}
					style={styles.textInput}
					autoFocus={true}
					autoCapitalize={'words'}
					defaultValue={this.props
						&& this.props.data
						&& this.props.data.viewer
						&& this.props.data.viewer.profile
						&& this.props.data.viewer.profile.name
					}
				/>
				<Button
					title='Update'
					buttonStyle={{backgroundColor: '#ff4b48', marginTop:10}}
					onPress={this._updateInfo.bind(this)}
					disabled={!this.state.nameEdited}
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



