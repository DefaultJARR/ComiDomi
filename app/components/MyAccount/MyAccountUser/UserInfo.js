import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Avatar } from 'react-native-elements';

// Firebase
import * as firebase from 'firebase';

// Components
import UpdateUserInfo from './UpdateUserInfo'

export default class UserInfo extends Component {

    constructor() {
        super();
        this.state = {
            userInfo: {}
        }
    }

    componentDidMount = async () => {
        await this.getUserInfo();
    }

    // Consulta a Firebase la info del Usuario Actual
    getUserInfo = () => {
        const user = firebase.auth().currentUser; // Todos los Datos del Usuario Logueado
        user.providerData.forEach(userInfo => {
            this.setState({ userInfo }); // =  this.setState({ userInfo : userInfo });
        });
    }

    // Valida si si se cargó o no una Url de Avatar de Usuario
    checkUserAvatar = photoURL => {
        return photoURL
            ? photoURL
            : "https://api.adorable.io/avatars/285/abott@adorable.png";
    }

    // Modifica en Firebase el Nombre del Usuario // Se envia por atributos a "UpdateUserInfo"
    updateUserName = async newUserName => {
        console.log("updateUserName En UserInfo.js... : ", newUserName);
        const update = { displayName: newUserName }
        await firebase.auth().currentUser.updateProfile(update);
        this.getUserInfo()
    }

    // Valida si ya se Cargó al State la información del Usuario desde Firebase, para empezar a cargar al ListItem de "UpdateUserInfo"
    returnUpdateUserInfoComponent = userInfoData => {
        if (userInfoData.hasOwnProperty("uid")) {
            return (
                <UpdateUserInfo
                    userInfo={this.state.userInfo}
                    updateUserName={this.updateUserName}
                />
            )
        }
    }

    render() {
        const { displayName, email, photoURL } = this.state.userInfo;

        return (
            <View>
                <View style={styles.viewBody}>
                    <Avatar
                        rounded
                        size="large"
                        source={{ uri: this.checkUserAvatar(photoURL) }}
                        containerStyle={styles.userAvatar}
                    />
                    <View>
                        <Text style={styles.userName}>{displayName}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>
                </View>
                {this.returnUpdateUserInfoComponent(this.state.userInfo)}

                {/* Update User Info - Se pasó a la Funcion "returnUpdateUserInfoComponent"
                <UpdateUserInfo
                    userInfo={this.state.userInfo}
                    updateUserName={this.updateUserName}
                /> */}
            </View>

        );
    }

}

const styles = StyleSheet.create({
    viewBody: {
        alignItems: "center",
        justifyContent: "center",
        // flexDirection: "row", // Para que todo lo que esté en el view no se comporte como display: BLOCK
        paddingVertical: 30,
        backgroundColor: "#f2f2f2"
    },
    userAvatar: {
        marginHorizontal: 20,
        marginBottom: 8
    },
    userName: {
        fontWeight: "bold",
        fontSize: 20
    },
    email: {}
});
