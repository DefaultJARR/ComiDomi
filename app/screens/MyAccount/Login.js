import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Text, Image, SocialIcon, Divider } from 'react-native-elements';

// Toast
import Toast, { DURATION } from 'react-native-easy-toast';

// Tcomb
import t from 'tcomb-form-native';
const Form = t.form.Form;

// Firebase
import * as firebase from 'firebase';

// Facebook
import * as Facebook from 'expo-facebook';
import FacebookApi from '../../utils/Social';


import { LoginStruct, LoginOptions } from '../../forms/LoginForm';



export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            loginStruct: LoginStruct,
            loginOptions: LoginOptions,
            formData: {
                email: "",
                password: ""
            },
            loginErrorMessage: ""
        }
    }

    login = () => {
        const valid = this.refs.loginForm.getValue();
        const formData = this.state.formData;

        if (formData.email == "" || formData.password == "") {
            this.setState({ loginErrorMessage: "Todos los son Campos Obligatorios" });
        }
        else {
            if (!valid) {
                this.setState({ loginErrorMessage: "Verifica el Formato de los Datos (Email con @ y .) y (Contraseña con mas de 5 caracteres) " });
            }
            else {
                // Firebase
                firebase
                    .auth()
                    .signInWithEmailAndPassword(valid.email, valid.password)
                    .then(() => {
                        this.setState({ loginErrorMessage: "" });
                        this.refs.toast.show('Login Correcto', 1500, () => {
                            this.props.navigation.navigate("MyAccount");
                        });
                    })
                    .catch(err => {
                        console.log(err.code, " - ", err.message);
                        if (err.code == "auth/user-not-found" || err.code == "auth/wrong-password") {
                            this.setState({ loginErrorMessage: "Usuario o Contraseña Incorrectos" });
                        }
                        else {
                            this.setState({ loginErrorMessage: "Error Desconocido" });
                        }
                    })

            }
        }
    }

    loginFacebook = async () => {

        try {
            const {
                type, token, expires, permissions, declinedPermissions
            } = await Facebook.logInWithReadPermissionsAsync(FacebookApi.aplication_id, {
                permissions: FacebookApi.permissions
            });
            if (type === 'success') {
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                const credentials = firebase.auth.FacebookAuthProvider.credential(token);
                firebase.auth().signInWithCredential(credentials)
                    .then(() => {
                        this.refs.toast.show('Inicio de Sesion con Facebook Exitoso', 1500, () => {
                            this.props.navigation.goBack();
                        });
                    })
                    .catch(err => {
                        this.refs.toast.show('Error en el Inicio de Sesion con Facebook, intentalo mas tarde', 1500);
                    })
                console.log('Logged in!', `Hi ${(await response.json()).name}!`);
            }
            else if (type === 'cancel') {
                this.refs.toastCancel.show('Inicio de Sesion con Facebook Cancelado', 1500);
            }
            else {
                this.refs.toastCancel.show('Error desconocido con el Inicio de Sesion con Facebook', 1500);
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

    onChangeLogin = (formValue) => {
        this.setState({ formData: formValue });
    }



    render() {
        const { loginStruct, loginOptions, loginErrorMessage } = this.state;

        return (
            <ScrollView>
                <View style={styles.viewBody}>
                    <Image
                        source={require('../../../assets/img/5-tenedores-letras-icono-logo.png')}
                        style={styles.logo}
                        containerStyle={styles.containerLogo}
                        PlaceHolderContent={<ActivityIndicator />}
                        resizeMode="contain"
                    />

                    <Form
                        ref="loginForm"
                        type={loginStruct}
                        options={loginOptions}
                        value={this.state.formData}
                        onChange={(formValue) => this.onChangeLogin(formValue)}
                    />
                    <Button buttonStyle={styles.loginButton} title="Iniciar Sesión" onPress={() => this.login()} />
                    <Text style={styles.textRegister}>
                        ¿Aún no tienes Cuenta? <Text style={styles.btnRegister} onPress={() => this.props.navigation.navigate("Register")}>Registrate</Text>
                    </Text>
                    <Text style={styles.loginErrorMessage} >{loginErrorMessage}</Text>

                    <Divider style={styles.divider} />

                    <SocialIcon title="Ingresa con Facebook" button type="facebook" onPress={() => this.loginFacebook()} />

                    <Toast
                        ref="toast"
                        position="bottom"
                        positionValue={200}
                        fadeInDuration={300}
                        fadeOutDuration={300}
                        opacity={0.8}
                        style={{ backgroundColor: "#00a680" }}
                        textStyle={{ color: "#fff" }}
                    />
                    <Toast
                        ref="toastCancel"
                        position="bottom"
                        positionValue={200}
                        fadeInDuration={300}
                        fadeOutDuration={300}
                        opacity={0.8}
                        style={{ backgroundColor: "#f00" }}
                        textStyle={{ color: "#fff" }}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        padding: 30,
        // borderWidth: 1,
        // borderColor: "black"
    },
    logo: {
        width: "100%",
        height: 175,
        marginBottom: 30
    },
    loginButton: {
        backgroundColor: "#00a680",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    textRegister: {
        alignSelf: "center",
        marginTop: 15,
        marginHorizontal: 10
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    },
    loginErrorMessage: {
        color: "#f00",
        textAlign: "center",
        marginVertical: 15
    },
    divider: {
        backgroundColor: "#ccc",
        marginBottom: 20
    }
});