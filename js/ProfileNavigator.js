import Profile from './Profile'
import Settings from './Profile/Settings'
import NameSettings from './Profile/ProfileSettings'
import PasswordSettings from './Profile/PasswordSettings'
import Calendar from './Profile/Calendar'
import FriendshipSettings from './Profile/FriendshipSettings'
import { StackNavigator } from 'react-navigation'


export default StackNavigator({
	Profile: {screen: Profile},
	Settings: {screen: Settings},
	NameSettings: {screen: NameSettings},
	PasswordSettings: {screen: PasswordSettings},
	PersonCalendar: {
		path: 'PersonalCalendar/:_id',
		screen: Calendar
	},
	FriendshipSettings: {
		path: 'FriendshipSettings/:_id',
		screen: FriendshipSettings
	}
})