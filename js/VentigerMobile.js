import { StackNavigator } from 'react-navigation';
import Entry from './Entry'
import Login from './Login'

export default StackNavigator({
    Entry: {screen: Entry},
    Login: {screen: Login},
})