import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

import * as firebase from 'firebase';

// Guests
import MyAccountGuest from '../../components/MyAccount/MyAccountGuest';

export default class MyAccount extends Component {

    constructor() {
        super();
        this.state = {
            loginState: false
        }
    }

    async componentDidMount() {
        await firebase.auth().onAuthStateChanged(res => {
            if (res) {
                console.log("Logueado");
                this.setState({ loginState: true });
            }
            else {
                this.setState({ loginState: false });
            }
        });
    }

    changeScreen = nameScreen => {
        this.props.navigation.navigate(nameScreen);
    }

    logOut = () => {
        this.refs.toast.show('Logging Out...', 1500, () => {
            firebase.auth().signOut();
        });
    }

    render() {
        const state = this.state;

        if (state.loginState) {
            return (
                <View style={styles.viewBody}>
                    <Text>Estás Logueado</Text>
                    <Button title="LogOut" onPress={() => this.logOut()} />
                    <Toast
                        ref="toast"
                        position="bottom"
                        positionValue={200}
                        fadeInDuration={300}
                        fadeOutDuration={300}
                        opacity={0.8}
                        style={{ backgroundColor: "#c70e33" }}
                        textStyle={{ color: "#fff" }}
                    />
                </View>
            );
        }
        else {
            return (
                <MyAccountGuest changeScreen={this.changeScreen} />
            );
        }
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});