import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
//import Button from 'react-native-button'
//import {Text, Icon, Container, Content, Left, Right, Grid } from 'native-base'
import { Grid, Row, Col, Button} from 'react-native-elements'
import { graphql, gql } from 'react-apollo'
const strings = require('../strings').default.profile
import Icon from 'react-native-vector-icons/Ionicons';

class Calendar extends Component {
	static navigationOptions = {
		title:
		({state}) => {
			return (state.params && state.params.name)
				|| strings.calendar
		},
		tabBar: {
			label: strings.calendar,
			icon: (args) => {
				console.log('icon args', args)
				const { tintColor } = args
				return (
					<Icon name="ios-calendar"
						  size={30}
						  color={tintColor}
					/>
				)
			}
		}
	}

	/*<Image
	 source={require('./Icons/Calendar_icon_2.svg.png')}
	 style={{height: 30, width: 35, tintColor: tintColor}}
	 />
	 */

	/*componentWillMount() {
		Icon.getImageSource('md-arrow-back', 30).then((source) => this.setState({ navIcon: source }));
	}*/

	_settings() {
		const { navigate } = this.props.navigation
		navigate('Settings')
	}

	componentWillMount() {
		if (!this.props.loading) {
			this.props.refetch()
		}
	}

	_renderProfile() {
		if (this.props.loading) {
			return <Text>{strings.loading + '...'}</Text>
		}
		if (this.props.profile) {
			return (<Text>{this.props.profile.name}</Text>)
		}
		return null
	}

	render() {
		//const { navigate } = this.props.navigation
		// console.log(this.props.data)
		return (
			<Grid>
				<Row size={2}>
					<Col size={1}>
						<Image
							//source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
							source={{uri: 'https://img.tinychan.org/img/1360567490218199.jpg'}}
							style={{"width":100, "height":100, marginTop: 10,
							 borderRadius: 50, alignSelf: 'center'}}
						/>
					</Col>
					<Col size={2} >
							<Text style=
									  {{paddingBottom: 7, fontSize: 20,
									  textAlign: 'center', paddingTop: 20
									  }}>
								{this._renderProfile()}
							</Text>
							<Button
								icon={{name: 'edit'}}
								buttonStyle={{
									marginTop: 0, marginLeft: 15,
									marginRight: 15, paddingBottom: 7,
									paddingTop: 5,
									backgroundColor: '#5f93ff'
								}}
								title={'Edit Profile'}
								onPress={this._settings.bind(this)}
							/>
					</Col>

				</Row>
				<Row size={8} style={{ marginTop:5, backgroundColor: '#eaeeff'}}>
				</Row>
			</Grid>
		)
	}
}

const getProfile = gql`
	query ($_id:ID){
		viewer {
			profile(_id:$_id){
				name
				_id
			}
		}
	}
`

const CalendarWithData = graphql(getProfile, {
	options: ({navigation}) => ({
		variables: {
			_id: (
				(navigation
				&& navigation.state
				&& navigation.state.params
				&& navigation.state.params._id
			) || null)
		}
	}),
	props: ({ ownProps, data: { loading, viewer, refetch}}) => {
		console.log(viewer)
		return {
			loading,
			profile: viewer && viewer.profile,
			refetch
		}
	}
})(Calendar)

export default CalendarWithData