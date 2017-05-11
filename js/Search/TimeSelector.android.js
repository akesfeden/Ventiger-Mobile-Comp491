import React, {Component, PropTypes} from "react";
import {DatePickerAndroid, TimePickerAndroid, TouchableNativeFeedback, View} from "react-native";
import {Text} from "react-native-elements";

export default class TimeSelectorAndroid extends Component {
    // constructor(props){
    //     super(props)
    // }

    async _askDate() {
        const {dateTime, dateSelector: {options = {}, onChange}} = this.props
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                ...options,
                dateTime
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const newDate = new Date(dateTime)
                newDate.setYear(year)
                newDate.setMonth(month)
                newDate.setDate(day)
                onChange(newDate)
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    async _askTime() {
        const {dateTime, timeSelector: {options = {}, onChange}} = this.props
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
                ...options,
                hour: dateTime.getHours(),
                minute: dateTime.getMinutes()
                //is24Hour: undefined, // Will display '12/24 according to locale
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                const newDate = new Date(dateTime)
                newDate.setHours(hour)
                newDate.setMinutes(minute)
                onChange(newDate)
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    _renderDateOrTime(title = '', text = '', onPress) { // Maybe add style argument
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
        const {dateTime, dateSelector, timeSelector} = this.props
        return (
            <View>
                { dateSelector ? this._renderDateOrTime(dateSelector.title, dateTime.toLocaleDateString(), this._askDate.bind(this))
                    : null }
                { timeSelector ? this._renderDateOrTime(timeSelector.title, dateTime.toLocaleTimeString(), this._askTime.bind(this))
                    : null }
            </View>
        )
    }
}

TimeSelectorAndroid.propTypes = {
    dateTime: PropTypes.object,
    dateSelector: PropTypes.shape({
        title: PropTypes.string,
        options: PropTypes.object,
        onChange: PropTypes.func,
    }),
    timeSelector: PropTypes.shape({
        title: PropTypes.string,
        options: PropTypes.object,
        onChange: PropTypes.func,
    })
}