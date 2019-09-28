import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import * as firebase from 'firebase';

// Guests
import MyAccountGuest from '../../components/MyAccount/MyAccountGuest';
import MyAccountProfile from '../../components/MyAccount/MyAccountUser';

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
        firebase.auth().signOut();
    }

    render() {
        const state = this.state;

        if (state.loginState) {
            return (<MyAccountProfile logOut={this.logOut} />);
        }
        else {
            return (<MyAccountGuest changeScreen={this.changeScreen} />);
        }
    }
}

const styles = StyleSheet.create({});