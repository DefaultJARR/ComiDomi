import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Text, ListItem } from 'react-native-elements';

// Firebase
import * as firebase from 'firebase';

// Components
import OverlayOneInput from '../../Globals/OverlayOneInput';

export default class UpdateUserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props,
            overlayComponent: null,
            menuItems: [
                {
                    title: "Cambiar Nombres y Apellidos",
                    iconType: "material-community",
                    iconNameLeft: "account-circle",
                    iconColorLeft: "#ccc",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    // Se lla
                    onPress: () => this.openOverlay("Nuevo Nombre y Apellido", this.updateUserName)
                },
                {
                    title: "Cambiar Email",
                    iconType: "material-community",
                    iconNameLeft: "at",
                    iconColorLeft: "#00a680",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    onPress: () => { firebase.auth().signOut() }
                },
                {
                    title: "Cambiar Nombres y Apellidos",
                    iconType: "material-community",
                    iconNameLeft: "lock-reset",
                    iconColorLeft: "#0d6fd1",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    onPress: () => { console.log("Cambio de Info de Password") }
                },
            ]
        }
        console.log("State en UpdateUserInfo.js... : ", this.state);

    }

    // Invoca el Overlay definido en el Componente "OverlayOneInput" y Envia el placeholder definido 
    // en el State y la Función que viene desde "UserInfo"
    openOverlay = (placeholder, updateUserName) => {
        this.setState({
            overlayComponent:
                <OverlayOneInput
                    isVisible={true}
                    placeholder={placeholder}
                    updateUserName={updateUserName}
                    inputValue={this.state.userInfo.displayName}
                />
        })
    }

    // Utiliza la Funcion "updateUserName" que llegó desde "UserInfo" recibiendo el Nuevo
    // UserName que llega desde "overlayComponent"
    updateUserName = newUserName => {
        this.state.updateUserName(newUserName);
        this.setState({
            overlayComponent: null
        });
    }

    render() {
        const { menuItems, overlayComponent } = this.state;

        return (
            <View>
                {
                    menuItems.map((item, i) => (
                        <ListItem
                            containerStyle={styles.listContainer}
                            key={i}
                            title={item.title}
                            leftIcon={{
                                type: item.iconType,
                                name: item.iconNameLeft,
                                color: item.iconColorLeft
                            }}
                            rightIcon={{
                                type: item.iconType,
                                name: item.iconNameRight,
                                color: item.iconColorRight
                            }}
                            onPress={item.onPress}
                        />
                    ))
                }
                {overlayComponent}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    listContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    }
});