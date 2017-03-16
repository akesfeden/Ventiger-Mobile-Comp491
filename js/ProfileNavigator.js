import Profile from './Profile'
import Settings from './Profile/Settings'
import { StackNavigator } from 'react-navigation'

export default StackNavigator({
	Profile: {screen: Profile},
	Settings: {screen: Settings}
})