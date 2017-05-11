import React, {Component} from "react"
import { View, DatePickerIOS , Text} from 'react-native'
import { NavigationActions } from 'react-navigation'
import {Button, FormInput, FormLabel, CheckBox, ButtonGroup, Grid, Row, Col} from "react-native-elements"

export default class CreatePoll extends Component {
	static navigationOptions = {
		title: 'New Poll'
	}

	constructor(props) {
		super(props)
		const startTime = new Date()
		const endTime = new Date(startTime)
		endTime.setHours(startTime.getHours()+2)
		this.state = {
			title: '',
			connectLocation: false,
			connectTime: false,
			selectedIndex: 0,
			addingOptions: false,
			settingConnections: false,
			options: [],
			startTime,
			endTime,
			editingStartTime: false,
			editingEndTime: false,
			location: null,
			multi: true
		}
		//this._initOptionState()
	}

	async _registerPollBody() {
		const dispatcher = this.props.navigation.state.params.dispatcher
		const body = {
			title: this.state.title,
			autoUpdateFields: [],
			options: this.state.options,
			multi: this.state.multi
			//this._addOption(true)
		}
		if (this.state.connectLocation) {
			body.autoUpdateFields.push('location')
		}
		if (this.state.connectTime) {
			body.autoUpdateFields.push('time')
		}
		switch (this.state.selectedIndex) {
			case 0:
				body.autoUpdateType = 'ALWAYS'
				break
			case 1:
				body.autoUpdateType = 'FINISH'
				break
			case 2:
				body.autoUpdateType = null
				body.autoUpdateFields = null
				break
			default: break
		}
		const success = await dispatcher.createPoll(body)
		// TODO: add error message
		if (success) {
			this.props.navigation.dispatch(NavigationActions.back())
		}
	}

	_reinitOptionState(options) {
		const startTime = new Date()
		const endTime = new Date(startTime)
		endTime.setHours(startTime.getHours()+2)
		this.setState({
			...this.state,
			startTime,
			endTime,
			editingStartTime: false,
			editingEndTime: false,
			options: options,
			location: null,
			description: ""
		})
	}

	_renderAutoUpdate() {
		const component1 = () => <Text style={{alignSelf:'center'}}>Always</Text>
		const component2 = () => <Text style={{alignSelf:'center'}}>End</Text>
		const component3 = () => <Text style={{alignSelf:'center'}}>Never</Text>
		const buttons = [{ element: component1 }, { element: component2 }]//, { element: component3 }]
		if (this.state.connectLocation || this.state.connectTime) {
			return [
				(<FormLabel>Auto-update mode</FormLabel>),
				(<ButtonGroup
					onPress={i => this.setState({...this.state, selectedIndex: i})}
					selectedIndex={this.state.selectedIndex}
					buttons={buttons}
					containerStyle={{height: 40}}
				/>)
			]
		}
	}

	 _renderStart() {
		return (
			<View>
				<FormLabel>Poll Title</FormLabel>
				<FormInput
					containerStyle={{marginBottom: 10}}
					onChangeText={text=>this.setState({...this.state, title: text})}
					value={this.state.title}
				/>
				<CheckBox
					title='Allow voting multiple options'
					checked={this.state.multi}
					onPress = {() => this.setState({...this.state, multi: !this.state.multi})}
				/>
				<Button
					buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#54aec3'}}
					title='Setup Connections'
					onPress={() => {
									this.setState({...this.state, settingConnections: true})
								}}
					disabled={!Boolean(this.state.title.length)}
				/>
			</View>
		)
	}

	_renderConnections() {
		return (
			<View>
				<CheckBox
					title='Connect Time'
					checked={this.state.connectTime}
					onPress = {() => this.setState({
												...this.state,
												connectTime: !this.state.connectTime
											})}
				/>
				<CheckBox
				title='Connect Location'
				checked={this.state.connectLocation}
				onPress = {() => this.setState({
					...this.state,
					connectLocation: !this.state.connectLocation
				})}
				/>
				{this._renderAutoUpdate()}
				<Button
					buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#c369b6'}}
					title='Start Adding Options'
					onPress={() => {
									this.setState({...this.state, addingOptions: true})
								}}
					disabled={!Boolean(this.state.title.length)}
				/>
			</View>
		)
	}

	_addOption(noreinit) {
		const option = {
			time: (this.state.connectTime && {
				startTime: this.state.startTime,
				endTime: this.state.endTime,
			}) || null,
			description: this.state.description || null,
			location: (this.state.connectLocation && {info: this.state.location}) || null
		}
		let options = Array.from(this.state.options)
		options.push(option)
		console.log('Options ', this.state.options)
		console.log('Options ', options)
		if (!noreinit) {
			this._reinitOptionState(options)
		}
		return options
	}

	_renderOptionAdder() {
		const components = []
		// Push time selector
		if (this.state.connectTime) {
			components.push((<Text onPress={()=>this.setState({...this.state, editingStartTime: !this.state.editingStartTime})}
								   style={{margin: 15}}>Start Time: {this.state.startTime.toLocaleString()}</Text>))

			if (this.state.editingStartTime) {
				components.push((
					<DatePickerIOS
						date={this.state.startTime}
						mode="datetime"
						onDateChange={date => this.setState({...this.state, startTime: date})}
					/>
				))
				return components
			}
			components.push((
				<Text onPress={()=>this.setState({...this.state, editingEndTime: !this.state.editingEndTime})} style={{margin: 15}}>
					End Time: {this.state.endTime.toLocaleString()}
				</Text>
			))
			if (this.state.editingEndTime) {
				components.push((
					<DatePickerIOS
						date={this.state.endTime}
						mode="datetime"
						onDateChange={date => this.setState({...this.state, endTime: date})}
					/>
				))
				return components
			}
		}
		// Push location selector
		if (this.state.connectLocation) {
			components.push((
				<FormLabel>Location</FormLabel>
			))
			components.push((
				<FormInput
					value = {this.state.location}
					onChangeText = {(text) => this.setState({...this.state, location: text})}
				/>
			))
		}
		// If nothing here, prompt a simple text
		if (components.length === 0) {
			components.push((
				<FormLabel>Option Description</FormLabel>
			))
			components.push(
				<FormInput
					value={this.state.description}
					onChangeText={text => this.setState({
						...this.state,
						description: text
					})}
				/>
			)
		}
		components.push((
			<Button
				buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#3dc394'}}
				title='Save Option'
				onPress={() => {
					this._addOption()
				}}
			/>
		))
		components.push((
			<Button
				buttonStyle={{marginTop:20, marginLeft: 30, marginRight: 30, backgroundColor: '#43c2c3'}}
				title='Done'
				onPress={this._registerPollBody.bind(this)}
			/>
		))
		return components
	}

	render() {
		if (this.state.addingOptions) {
			return (
				<View>
					<Text onPress={() => this.setState({...this.state, addingOptions:false})} style={{margin: 15, fontSize:16}}>
						Poll: {this.state.title} ({this.state.options.length} options)
					</Text>
					{this._renderOptionAdder()}
				</View>
			)
		}
		if (this.state.settingConnections) {
			return this._renderConnections()
		}
		return this._renderStart()
	}
}