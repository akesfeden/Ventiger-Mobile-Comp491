import {TabNavigator} from "react-navigation";
import Calendar from "./Calendar";
import Friends from "./Friends";
import Events from "./Events";
import Notifications from "./Notifications";

export default TabNavigator({
	Calendar: {screen: Calendar},
	Friends: {screen: Friends},
    Events: {path: 'Events/:date', screen: Events},
	Notifications: {screen: Notifications}
}, {
    tabBarOptions: {

        style: {
            backgroundColor: '#2AB1B8',
        },
    }
})