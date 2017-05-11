import React from "react";
import {DatePickerAndroid, TimePickerAndroid, TouchableNativeFeedback, View} from "react-native";
import {Button, Text} from "react-native-elements";
import EventTimeSelectorBase from "./EventTimeSelectorBase";

export default class EventTimeSelector extends EventTimeSelectorBase {

    async _setStartDate() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: this.state.startTime
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const newDate = new Date(this.state.startTime)
                newDate.setYear(year)
                newDate.setMonth(month)
                newDate.setDate(day)
                this._onStartTimeChange(newDate)
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    async _setEndDate() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                minDate: this.state.startTime,
                date: this.state.endTime
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const newDate = new Date(this.state.endTime)
                newDate.setYear(year)
                newDate.setMonth(month)
                newDate.setDate(day)
                this._onEndTimeChange(newDate)
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    async _setTime(date, callback) {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: date.getHours(),
                minute: date.getMinutes(),
                //is24Hour: undefined, // Will display '12/24 according to locale
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                const newDate = new Date(date)
                newDate.setHours(hour)
                newDate.setMinutes(minute)
                callback.call(this, newDate)
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    _setStartTime() {
        return this._setTime(this.state.startTime, this._onStartTimeChange)
    }

    _setEndTime() {
        return this._setTime(this.state.endTime, this._onEndTimeChange)
    }

    _renderDateTime(title, text, onPress) { // Maybe add style argument
        return (<View>
                <Text style={{marginLeft: 10, fontSize: 16}}>{title}</Text>
                <TouchableNativeFeedback
                    onPress={onPress}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={{alignSelf: 'center', width: '100%', height: 50, backgroundColor: '#33668822'}}>
                        <Text style={{alignSelf: 'center', fontSize: 20, margin: 10}}>
                            {text}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }

    render() {
        return (
            <View>
                <Text style={
                    {fontSize: 18, marginBottom: 10, alignSelf: 'center'}}>
                    Select Event Time
                </Text>

                {this._renderDateTime(
                    'Starting Date',
                    this.state.startTime.toLocaleDateString(),
                    this._setStartDate.bind(this))}
                {this._renderDateTime(
                    'Starting Time',
                    this.state.startTime.toLocaleTimeString(),
                    this._setStartTime.bind(this))}
                {this._renderDateTime(
                    'Ending Date',
                    this.state.startTime.toLocaleDateString(),
                    this._setEndDate.bind(this))}
                {this._renderDateTime(
                    'Ending Time',
                    this.state.endTime.toLocaleTimeString(),
                    this._setEndTime.bind(this))}


                {this._renderErrorText()}
                <Button
                    title="Done"
                    buttonStyle={{marginTop: 10, backgroundColor: '#5dc370'}}
                    disabled={!this._isValid()}
                    onPress={() => this.props.onDone(this.state.startTime, this.state.endTime)}
                />
                <Button
                    title="Cancel"
                    buttonStyle={{backgroundColor: '#c35655', marginTop: 5}}
                    onPress={this.props.onCancel}
                />
            </View>

        )
    }
}