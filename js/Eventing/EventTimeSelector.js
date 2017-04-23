import React, {Component} from "react";
import {
	View,
	DatePickerIOS
} from 'react-native';
import { Text, Button, FormLabel } from 'react-native-elements'

import DropDown, {
	Select,
	Option,
	OptionList
} from 'react-native-selectme'


export default class EventTimeSelector extends Component {
	constructor(props) {
		super(props);
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]
	}

	_getMonthList() {
		return this.refs['MONTHLIST'];
	}

	render() {
		return (
			<View>
				<Text style={
					{fontSize:18, marginBottom:10, alignSelf:'center'}}>
					Select Event Time
				</Text>
				<Text style={{fontSize:16}}>Starting Time</Text>
				<DatePickerIOS
					date={new Date()}
					mode="datetime"
				/>
				<Text style={{fontSize:16}}>Ending Time</Text>
				<DatePickerIOS
					date={(
						() => {
							const a = new Date()
							a.setHours(a.getHours()+2)
							return a
						})()
					}
					mode="datetime"
				/>
				<Button
					title="Done"
					buttonStyle={{backgroundColor: '#5dc370'}}
				/>
				<Button
					title="Cancel"
					buttonStyle={{backgroundColor: '#c35655', marginTop:5}}
					onPress={this.props.onCancel}
				/>
			</View>

		)
	}

	/*render() {
		return (
			<View>
				<Text>Starting Time</Text>
				<Grid>
					<Col>
						<Select
								width={100}
								optionListRef={this._getMonthList.bind(this)}>
								{
									this.months.map((m, i) => (
										<Option>{i+1}</Option>
									))
								}
							</Select>
						</Col>
						<Col>
							<Select
								width={100}
								optionListRef={this._getMonthList.bind(this)}>
								{
									this.months.map(m => (
										<Option>{m}</Option>
									))
								}
							</Select>
						</Col>
						<Col>
							<Select
								width={100}
								optionListRef={this._getMonthList.bind(this)}>
								{
									(() => {
										let now = new Date()
										const years = []
										for (let i = 0; i < 5; ++i) {
											years.push((
												<Option>{now.getFullYear()+i}</Option>
												)
											)
										}
										return years
									})()
								}
							</Select>
						</Col>

				</Grid>
				<OptionList ref="MONTHLIST"/>
			</View>
		);
	}*/
}