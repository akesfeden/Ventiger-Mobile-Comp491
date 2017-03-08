import React, {Component} from 'react'
import {
    View,
    TextInput
} from 'react-native'
import Button from 'react-native-button'
import VStyleSheet from './VStyleSheet'

export default class Login extends Component {
    static navigationOptions = {
        title: "Login"
    }

    constructor(props) {
        super(props)
        this.state = {
            password: '',
            email: '',
            phone: '',
            usePhone: true
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput placeholder="Phone" onChangeText={(text) => this.setState({...this.state, phone: text})}
                           value={this.state.phone}
                           style={styles.textInput}
                           keyboardType={'phone-pad'}
                />
                <TextInput placeholder="Password"
                           secureTextEntry={true}
                           onChangeText={(text) => this.setState({...this.state, password: text})}
                           value={this.state.password}
                           style={styles.textInput}
                />
                <Button containerStyle={styles.containerStyle} style={styles.style} onPress={()=>console.log("foo")}>
                    Login
                </Button>
            </View>
        );
    }
}

const styles = VStyleSheet({
    container: {
        flex: 0.7,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
        //height: '40%',
    },
    textInput: {
        width: '70%',
        marginTop: 10,
        marginBottom: 10
    },
    containerStyle: {
        padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: 'black',
        margin: 15, width: 250, marginTop: 30
    },

    style: {fontSize: 20, color: 'green'}
});