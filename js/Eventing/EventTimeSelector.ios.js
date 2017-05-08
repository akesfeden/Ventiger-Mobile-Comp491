import React from "react";
import {DatePickerIOS, View} from "react-native";
import {Button, Text} from "react-native-elements";
import EventTimeSelectorBase from "./EventTimeSelectorBase";


export default class EventTimeSelector extends EventTimeSelectorBase {


	render() {
        return (
			<View>
				<Text style={
                    {fontSize: 18, marginBottom: 10, alignSelf: 'center'}}>
					Select Event Time
				</Text>
				<Text style={{fontSize:16}}>Starting Time</Text>
				<DatePickerIOS
					date={this.state.startTime}
					mode="datetime"
					onDateChange={this._onStartTimeChange.bind(this)}
				/>
				<Text style={{fontSize:16}}>Ending Time</Text>
				<DatePickerIOS
					date={this.state.endTime}
					mode="datetime"
					onDateChange={this._onEndTimeChange.bind(this)}
				/>
                {this._renderErrorText()}
				<Button
					title="Done"
					buttonStyle={{backgroundColor: '#5dc370'}}
					disabled={!this._isValid()}
					onPress={() => this.props.onDone(this.state.startTime, this.state.endTime)}
				/>
				<Button
					title="Cancel"
					buttonStyle={{backgroundColor: '#c35655', marginTop:5}}
					onPress={this.props.onCancel}
				/>
			</View>

        )
	}

	/*
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