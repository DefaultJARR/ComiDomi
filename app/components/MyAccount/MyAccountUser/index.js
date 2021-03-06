import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements'

// Components
import UserInfo from './UserInfo';

export default class MyAccountProfile extends Component {

    constructor(props) {
        super(props);
    }

    logginOut() {
        this.refs.toast.show('Logging Out...', 1500, () => {
            this.props.logOut();
        });
    }

    render() {
        const props = this.props;

        return (
            <View>
                <UserInfo />
            </View>
        );
    }
}

const styles = StyleSheet.create({});
