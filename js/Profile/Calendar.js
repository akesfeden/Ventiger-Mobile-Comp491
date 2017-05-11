import React, {Component} from "react";
import {Image, ListItem, Text} from "react-native";
import {Button, Col, Grid, Row} from "react-native-elements";
import {compose, gql, graphql} from "react-apollo";
import Icon from "react-native-vector-icons/Ionicons";
import {Container, Fab, Icon as NbIcon} from "native-base";
import isLoggedIn from "../login-check";
import RnCalendar from "react-native-calendar";
const strings = require('../strings').default.profile

function handleTypeError(err) {
    // TODO Move this to where it fits
    if (err instanceof TypeError) {
        // Probably an NPE, suppress it
    } else {
        throw err
    }
}
const commonStyle = {
    buttonStyle: {
        marginTop: 0, marginLeft: 15,
        marginRight: 15, paddingBottom: 7,
        paddingTop: 5
    }
}
class Calendar extends Component {
    static navigationOptions = ({navigation}) => ({
        title: (navigation.state.params && navigation.state.params.name)
        || strings.calendar,
        tabBarLabel: strings.calendar,
        tabBarIcon: (args) => {
            console.log('icon args', args)
            const {tintColor} = args
            return (
                <Icon name="ios-calendar"
                      size={30}
                      color={tintColor}
                />
            )
        }
    })

    _onDateSelect(date) {
        console.log('EDATE', date)
        this.props.navigation.navigate('Events', {date: new Date(date)})
    }

    _getEventDates() {
        let events = []
        console.log('eevents', this.props.data)
        try {
            events = this.props.data.viewer.events
        } catch (err) {
            handleTypeError(err)
        }
        return events.reduce((all, event) => {
            try {
                all.push(event.time.startTime) //TODO
            } catch (err) {
                handleTypeError(err)
            }
            return all
        }, [])
    }

    _settings() {
        const {navigate} = this.props.navigation
        navigate('Settings')
    }

    _renderProfile() {
        if (this.props.loading) {
            return <Text>{strings.loading + '...'}</Text>
        }
        if (this.props.profile) {
            return (<Text>{this.props.profile.name}</Text>)
        }
        return null
    }

    _renderSettingsButton() {
        if (!this.props.relation) {
            return null
        }
        const {buttonStyle} = commonStyle
        switch (this.props.relation) {
            case "MYSELF":
                return (
                    <Button
                        icon={{name: 'edit'}}
                        buttonStyle={{
                            ...buttonStyle,
                            backgroundColor: '#5f93ff'
                        }}
                        title={strings.editProfile}
                        onPress={this._settings.bind(this)}
                    />
                )
            case "FRIEND":
                return (
                    <Button
                        icon={{name: 'settings'}}
                        buttonStyle={{
                            ...buttonStyle,
                            backgroundColor: '#a804ff'
                        }}
                        title={strings.friendshipSettings}
                        onPress={() => {
                            this.props.navigation.navigate('FriendshipSettings', this.props.profile)
                        }}
                    />
                )
            // TODO: Add request sent
            default:
                return (
                    <Button
                        icon={{name: 'add'}}
                        buttonStyle={{
                            ...buttonStyle,
                            backgroundColor: '#4dc37a'
                        }}
                        title={strings.sendFriendRequest}
                        onPress={() => this.props.addFriend({_id: this.props.profile._id})}
                    />
                )
        }
    }

    _renderCalendar() {
        if (this.props.relation) {
            switch (this.props.relation) {
                case 'MYSELF':
                case 'FRIEND':
                    return (
                        <RnCalendar
                            customStyle={{
                                eventIndicator: {
                                    backgroundColor: 'green',
                                    width: 10,
                                    height: 10,
                                }
                            }}
                            scrollEnabled={true}
                            showEventIndicators
                            eventDates={this._getEventDates()}
                            onDateSelect={this._onDateSelect.bind(this)}
                            weekStart={1}
                        />
                    )
            }
        }
        return null
    }

    _onCreateEvent() {
        this.props.navigation.navigate('EventCreation')
    }

    _renderCreateEventButton() {
        if (this.props.relation && this.props.relation === 'MYSELF') {
            //const {buttonStyle} = commonStyle
            return (<Fab
                    position="bottomRight"
                    active={false}
                    onPress={this._onCreateEvent.bind(this)}
                    containerStyle={{paddingTop: 100}}
                    style={{backgroundColor: '#2AB1B8'}}
                >
                    <NbIcon name="add"/>
                </Fab>
            )
        }
        return null
    }

    _onSearch() {
        this.props.navigation.navigate('Search', {cleanSearch: true})
    }

    _renderSearchButton() {
        if (this.props.relation && this.props.relation === 'MYSELF') {
            const {buttonStyle} = commonStyle
            return (<Button icon={{name: 'search'}} title={strings.search}
                            onPress={this._onSearch.bind(this)}
                            buttonStyle={{
                                /*marginTop: 5, marginLeft: 0,
                                 marginRight: 0, paddingBottom: 3,
                                 paddingTop: 3,*/
                                ...buttonStyle,
                                marginTop: 10,
                                backgroundColor: '#3cae73',
                            }}/>
            )
        }
        return null
    }

    render() {
        console.log(isLoggedIn())
        if (isLoggedIn()) {
            return null
        }
        return (
            <Container>
                <Grid>
                    <Row size={2}>
                        <Col size={1}>
                            <Image
                                source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}}
                                //source={{uri: 'https://img.tinychan.org/img/1360567490218199.jpg'}}
                                style={{
                                    "width": 100, "height": 100, marginTop: 10,
                                    borderRadius: 50, alignSelf: 'center'
                                }}
                            />
                        </Col>
                        <Col size={2}>
                            <Text style=
                                      {{
                                          paddingBottom: 7, fontSize: 20,
                                          textAlign: 'center', paddingTop: 20
                                      }}>
                                {this._renderProfile()}
                            </Text>
                            {this._renderSettingsButton()}
                            {this._renderSearchButton()}
                        </Col>

                    </Row>
                    <Row size={6} style={{marginTop: 5, backgroundColor: '#eaeeff'}}>
                        {this._renderCalendar()}
                    </Row>
                </Grid>
                {this._renderCreateEventButton()}
            </Container>
        )
    }

    _tryRefetch() {
        if (isLoggedIn()) {
            console.log('refetched...')
            this.props.refetch()
        }
    }

    componentDidMount() {
        this._tryRefetch()
    }

    componentDidUpdate() {
        this._tryRefetch()
    }
}
//<Text>Today</Text>

//TODO: reconsider when having nested relation
const getProfile = gql`
	query ($_id:ID){
		viewer {
			profile(_id:$_id){
				name
				_id
			}
			relation(_id: $_id)
		}
	}
`

const addFriend = gql`
	mutation($_id:ID!) {
		addFriend(_id:$_id)
	}
`
const getEventData = gql`
	query {
		viewer {
			events {
				_id
				title
				time {
					startTime
					endTime
				}
			}
		}
	}
`
const CalendarWithData = compose(
    graphql(getProfile, {
            options: ({navigation}) => ({
                variables: {
                    _id: (
                    (navigation
                        && navigation.state
                        && navigation.state.params
                        && navigation.state.params._id
                    ) || null)
                }
            }),
            props: ({ownProps, data: {loading, viewer, refetch}}) => {
                console.log(viewer)
                return {
                    loading,
                    profile: viewer && viewer.profile,
                    relation: viewer && viewer.relation,
                    refetch
                }
            }
        }
    ),
    graphql(addFriend, {
        props: ({mutate}) => ({
            addFriend: ({_id}) => {
                console.log("mutate ", _id)
                mutate({variables: {_id}})
            }
        })
    }),
    graphql(getEventData)
)(Calendar)

export default CalendarWithData