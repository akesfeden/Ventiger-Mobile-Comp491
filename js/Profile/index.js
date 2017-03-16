import { TabNavigator } from 'react-navigation'
import Calendar from './Calendar'
import Friends from './Friends'

export default TabNavigator({
	Calendar: { screen: Calendar },
	Friends: { screen: Friends}
})