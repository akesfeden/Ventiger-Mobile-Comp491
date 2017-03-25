import { TabNavigator } from 'react-navigation'
import Calendar from './Calendar'
import Friends from './Friends'
import Events from './Events'
import Notifications from './Notifications'

export default TabNavigator({
	Calendar: {screen: Calendar},
	Friends: {screen: Friends},
	Events: {screen: Events},
	Notifications: {screen: Notifications}
})