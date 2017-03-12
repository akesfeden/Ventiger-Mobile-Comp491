import { StackNavigator } from 'react-navigation';
import Entry from './Entry'
import Login from './Login'
import Profile from './Profile'
import PhoneRegistration from './Registration/PhoneRegistration'
import PasswordRegistration from './Registration/PasswordRegistration'
import NameRegistration from './Registration/NameRegistration'
import CodeRegistration from './Registration/CodeRegistration'


export default StackNavigator({
	Entry: {screen: Entry},
	Login: {screen: Login},
	//Profile: {screen: Profile},
	PhoneRegistration: {screen: PhoneRegistration},
	NameRegistration: {screen: NameRegistration},
	PasswordRegistration: {screen: PasswordRegistration},
	CodeRegistration: {screen: CodeRegistration}
})