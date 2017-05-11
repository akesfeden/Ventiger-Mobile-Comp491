import React, {Component} from "react";
import {Container, Text} from "native-base";
import {Button, CheckBox, FormInput, FormLabel} from "react-native-elements";
import DateTimeSelector from "./TimeSelector";
import {ActivityIndicator, View} from "react-native";
import {search, setSearchParams} from "../actions/search-actions";
import {connect} from "react-redux";

class SearchMain extends Component {

    static navigationOptions = ({navigation}) => {
        let fragmentIndex = 0
        try {
            fragmentIndex = navigation.state.params.fragmentIndex
        } catch (err) {
            if (!err instanceof TypeError) {
                throw err
            }
        }
        return {
            //headerLeft:null,
            headerTitle: 'Search' + (fragmentIndex ? ' (Additional Criteria)' : ''),
            /*headerTitle: (<Header searchBar rounded>
             <Item>
             <Icon name="ios-search" />
             <Input placeholder="Search" />
             <Icon name="ios-people" />
             </Item>
             <Button transparent>
             <Text>Search</Text>
             </Button>
             </Header>),*/
            headerRight: (fragmentIndex === 0 ?
                (<Text style={{marginRight: 10, color: '#f5f5f5'}}
                       onPress={() => navigation.navigate('Search', {fragmentIndex: 1})}>
                    More
                </Text>)
                : null)
            // headerRight: (<Container><Header searchBar>
            //     <Item>
            //         <Icon name="ios-search" />
            //         <Input placeholder="Search" />
            //         <Icon name="ios-people" />
            //     </Item>
            //     <NbButton >
            //         <Text>Search</Text>
            //     </NbButton>
            // </Header></Container>)
        }
    }

    constructor(props) {
        super(props)
        //this.state = {/*fragmentIndex: 1,*/ startDate: new Date()}
    }

    componentWillMount() {
        this._clearSearchIfRequired()
    }

    componentWillUpdate() {
        this._clearSearchIfRequired()
    }

    componentWillReceiveProps(newProps) {
        try {
            const {publicEvents} = newProps.results.data.viewer
            if (publicEvents) {
                this.props.navigation.navigate('SearchResults', {events: publicEvents})
            }
        } catch (err) {
            console.warn(err)
        }
    }

    _clearSearchIfRequired() {
        let cleanSearch = false
        try {
            cleanSearch = this.props.navigation.state.params.cleanSearch
        } catch (err) {
            if (!err instanceof TypeError) {
                throw err
            }
        }
        console.log('clean', cleanSearch)
        if (cleanSearch) {
            this.props.navigation.state.params.cleanSearch = false // Not fond of this...

            this.props.setParams({}, true)
        }
    }

    _onTextChanged(searchText) {
        this.props.setParams({searchText}, false)
    }

    _onDateChanged(date) {
        this.props.setParams({startDate: date}, false)
    }

    _fillQuery() {
        const {
            startDate,
            searchText,
            includeEventNames,
            includeLocInfos,
            includeParticipantNames,
            ignoreUntimed
        } = this.props.params

        const options = {}
        if (startDate) {
            options.from = JSON.stringify(startDate)
        }
        if (ignoreUntimed !== undefined) {
            options.ignoreUntimed = JSON.stringify(ignoreUntimed)
        }
        if (searchText) {
            const lookup = {
                eventTitles: includeEventNames,
                locationInfos: includeLocInfos,
                participantNames: includeParticipantNames,
            }
            const processedText = JSON.stringify(searchText.split(' '))
            Object.keys(lookup).forEach((key) => {
                if (lookup[key] !== undefined) {
                    options[key] = processedText
                }
            })
        }
        return Object.keys(options).length !== 0 ? buildQuery(options) : null

    }

    _renderMainSearchPage() {
        return (
            <View>
                <FormLabel >Find...</FormLabel>
                <FormInput onChangeText={this._onTextChanged.bind(this)} value={this.props.params.searchText}/>
                <CheckBox
                    title='Search Event Names'
                    checked={this.props.params.includeEventNames}
                    onPress={() => this.props.setParams({includeEventNames: !this.props.params.includeEventNames})}
                />
                <CheckBox
                    title='Search Location Names'
                    checked={this.props.params.includeLocInfos}
                    onPress={() => this.props.setParams({includeLocInfos: !this.props.params.includeLocInfos})}
                />
                <CheckBox
                    title='Search in Participant Names'
                    checked={this.props.params.includeParticipantNames}
                    onPress={() => this.props.setParams({
                        includeParticipantNames: !this.props.params.includeParticipantNames
                    })}
                />
                {/*<Button
                 buttonStyle={{marginTop: 20, marginLeft: 30, marginRight: 30, backgroundColor: '#54aec3'}}
                 title='Additional Criteria'
                 onPress={() => {
                 //this.setState({...this.state, settingConnections: true})
                 this.props.navigation.navigate('Search', {fragmentIndex: 1})
                 }}
                 disabled={!Boolean(this.state)}
                 />*/}

            </View>)
    }

    _renderAdditionalCriteriaPage() {
        return (
            <View>
                <DateTimeSelector
                    dateTime={this.props.params.startDate}
                    dateSelector={{title: 'Start Date', onChange: this._onDateChanged.bind(this)}}
                    timeSelector={{title: 'Start Time', onChange: this._onDateChanged.bind(this)}}
                />
                <CheckBox
                    title='Ignore Events without time information'
                    checked={this.props.params.ignoreUntimed}
                    onPress={() => this.props.setParams({ignoreUntimed: !this.props.params.ignoreUntimed}, false)}
                />
                <CheckBox
                    title='Show only events near me'
                    checked={this.props.params.onlyNearMe}
                    onPress={() => this.props.setParams({onlyNearMe: !this.props.params.onlyNearMe}, false)}
                />
            </View>
        )
    }

    _renderResults() {
        const {results} = this.props
        return (<Text>{"Result: " + JSON.stringify(results)}</Text>)
    }

    _getNavFragmentIndex() {
        let fragmentIndex = 0
        try {
            fragmentIndex = this.props.navigation.state.params.fragmentIndex
        } catch (err) {
            if (!err instanceof TypeError) {
                throw err
            }
        }
        if (this.props.results) {
            fragmentIndex = 2
        }
        return fragmentIndex
    }

    _renderInner() {
        switch (this._getNavFragmentIndex()) {
            case 1:
                return this._renderAdditionalCriteriaPage()
            case 2:
                return this._renderResults()
            case 0:
            default:
                return this._renderMainSearchPage()
        }
    }


    render() {
        return (
            <Container style={{paddingTop: 10}}>

                {this._renderInner()}
                {this.props.isLoading ? (<ActivityIndicator style={{marginTop: 20}} large color="#54aec3"/>)
                    : (<Button
                        buttonStyle={{marginTop: 20, marginLeft: 30, marginRight: 30, backgroundColor: '#54aec3'}}
                        title='Search'
                        onPress={() => {

                            this.props.fetchResults(this._fillQuery())
                        }}
                        disabled={Boolean(this.props.isLoading)}
                    />)}
            </Container>
        )
    }
}

function buildQuery(args = {}) {
    let vars = '';
    ['from', 'eventTitles', 'locationInfos', 'participantNames', 'ignoreUntimed'].forEach(
        (key) => {
            const val = args[key]
            if (val !== undefined) {
                vars += key + ':' + val + '\n'
            }
        })
    const query = `
    query{
        viewer{
            publicEvents(
                ${vars}
            ){
                    _id
                    title
                    time {
                        startTime
                        endTime
                    }
                    participants {
                        _id
                        name
                    }
            }
        }
    }
  `
    console.log('query', query)
    return query
}

const mapStateToProps = state => {
    const searchState = state.search
    return {
        results: searchState.payload,
        isLoading: searchState.isLoading,
        params: searchState.params
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchResults: (query) => query && dispatch(search(query)),
        setParams: (newParams, fromScratch) => dispatch(setSearchParams(newParams, fromScratch))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchMain)