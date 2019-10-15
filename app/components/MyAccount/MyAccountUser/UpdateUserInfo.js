import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

// Firebase
import * as firebase from 'firebase';

// Components
import OverlayOneInput from '../../Globals/OverlayOneInput';
import OverlayTwoInputs from '../../Globals/OverlayTwoInputs';
import OverlayThreeInputs from '../../Globals/OverlayThreeInputs';


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
                    iconColorLeft: "#e8ab02",
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
                    onPress: () => this.openOverlayTwoInputs("Nuevo Email", "Contraseña Actual", props.userInfo.email, this.updateUserEmail)
                },
                {
                    title: "Cambiar Contraseña",
                    iconType: "material-community",
                    iconNameLeft: "lock-reset",
                    iconColorLeft: "#0d6fd1",
                    iconNameRight: "chevron-right",
                    iconColorRight: "#ccc",
                    onPress: () => this.openOverlayThreeInputs("Contraseña Actual", "Nueva Contraseña", "Verifica Nueva Contraseña", this.updateUserPassword)
                },
            ]
        }
        // console.log("State en UpdateUserInfo.js... : ", this.state);

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

    // Invoca el Overlay definido en el Componente "OverlayTwoInput" y Envia el placeholder definido 
    // en el State y la Función que viene desde "UserInfo"
    openOverlayTwoInputs = (placeholderOne, placeholderTwo, inputValueOne, updateUserEmail) => {
        this.setState({
            overlayComponent:
                <OverlayTwoInputs
                    isVisible={true}
                    placeholderOne={placeholderOne}
                    placeholderTwo={placeholderTwo}
                    inputValueOne={inputValueOne}
                    inputValueTwo=""
                    password={true}
                    updateUserEmail={updateUserEmail}
                />
        })
    }

    // Invoca el Overlay definido en el Componente "OverlayThreeInput" y Envia el placeholder definido 
    // en el State y la Función que viene desde "UserInfo"
    openOverlayThreeInputs = (placeholderOne, placeholderTwo, placeholderThree, updateUserPassword) => {
        this.setState({
            overlayComponent:
                <OverlayThreeInputs
                    isVisible={true}
                    placeholderOne={placeholderOne}
                    placeholderTwo={placeholderTwo}
                    placeholderThree={placeholderThree}
                    inputValueOne=""
                    inputValueTwo=""
                    inputValueThree=""
                    password={true}
                    updateUserPassword={updateUserPassword}
                />
        })
    }

    // Utiliza la Funcion "updateUserName" que llegó desde "UserInfo" recibiendo el Nuevo
    // UserName que llega desde "overlayComponent"
    updateUserName = newUserName => {
        if (newUserName) {
            this.state.updateUserName(newUserName);
        }
        this.setState({
            overlayComponent: null
        });
    }

    updateUserEmail = async (newEmail, password) => {
        const emailOld = this.props.userInfo.email;

        if (emailOld != newEmail && password) {
            this.state.updateUserEmail(newEmail, password);
        }
        this.setState({ overlayComponent: null });
    }

    updateUserPassword = async (actualPassword, newPassword, confirmPassword) => {
        console.log("Validando Contraseña...");
        console.log(actualPassword, " - ", newPassword, " - ", confirmPassword);

        if (!actualPassword || !newPassword || !confirmPassword) {
            this.refs.toast.show("Todos los Campos son Obligatorios", 1500)
        }
        else {
            if (newPassword != confirmPassword) {
                this.refs.toast.show("Las contraseñas asignadas no Coinciden!!", 1500)
            }
            else {
                if (newPassword === actualPassword) {
                    this.refs.toast.show("La contraseña creada debe ser diferente a la Actual", 1500)
                }
                else {
                    this.state.updateUserPassword(actualPassword, newPassword);
                }

            }
        }

        this.setState({ overlayComponent: null });
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
                <Toast
                    ref="toast"
                    position="center"
                    positionValue={250}
                    fadeInDuration={750}
                    fadeOutDuration={750}
                    opacity={0.8}
                    containerStyle={{ justifyContent: 'center', alignContent: 'center' }}
                    textStyle={{ color: "#fff" }}
                />
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