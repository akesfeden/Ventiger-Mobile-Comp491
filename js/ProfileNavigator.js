import Profile from "./Profile";
import Settings from "./Profile/Settings";
import NameSettings from "./Profile/ProfileSettings";
import PasswordSettings from "./Profile/PasswordSettings";
import Calendar from "./Profile/Calendar";
import FriendshipSettings from "./Profile/FriendshipSettings";
import EventCreation from "./Eventing/EventCreation";
import Event from "./Eventing/Event";
import SearchMain from "./Search/SearchMain";
import {SearchResults} from "./Search/SearchResults";
import {StackNavigator} from "react-navigation";

import React from "react";
import {Icon} from "native-base";


export default StackNavigator({
        Profile: {
            screen: Profile, navigationOptions: {
                headerStyle: {backgroundColor: '#2AB1B8', elevation: 0, shadowOpacity: 0},
            }
        },
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
	},
	EventCreation: {screen: EventCreation},
	Event: {screen: Event},
	//EventInvitations: {screen: EventInvitations}
        Search: {screen: SearchMain},
        SearchResults: {screen: SearchResults}
    },
    {
        navigationOptions: ({navigation}) => ({
            headerStyle: {backgroundColor: '#2AB1B8'},
            //headerBackTitleStyle: {textColor: 'white'},
            headerTintColor: '#f5f5f5',
            headerRight: (<Icon name="search" style={{marginRight: 20, color: '#f5f5f5'}}
								onPress={() => navigation.navigate('Search', {cleanSearch: true})}/>)
        })
    })