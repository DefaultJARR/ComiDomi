import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { Button, Text, Image } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';

import * as firebase from 'firebase';

import t from 'tcomb-form-native';
const Form = t.form.Form;

import { RegisterStruct, RegisterOptions } from '../../forms/RegisterForm'


export default class Register extends Component {

    constructor() {
        super();
        this.state = {
            registerStruct: RegisterStruct,
            registerOptions: RegisterOptions,
            formData: {
                name: "",
                email: "",
                password: "",
                passwordConfirm: ""
            },
            formErrorMessage: ""
        }
    }

    register = () => {

        const formData = this.state.formData;
        console.log("Info Registro: ", formData);

        if (formData.name != "" && formData.email != "" && formData.password != "" && formData.passwordConfirm != "") {
            const valid = this.refs.registerForm.getValue();

            // Validacion Email
            if (formData.email.indexOf("@") != -1) {
                // Validacion de Contraseña
                if (formData.password.length >= 6) {
                    // Validacion Confirmacion Contraseña
                    if (formData.password === formData.passwordConfirm) {
                        if (valid) {
                            this.setState({ formErrorMessage: "" });

                            // Registro a Firebase
                            firebase.auth().createUserWithEmailAndPassword(valid.email, valid.password)
                                .then(res => {
                                    console.log("Registro Correcto");
                                    console.log(res);
                                    this.refs.toast.show('¡¡ Bienvenido !! Registro Completado', 1500, () => {
                                        this.props.navigation.navigate("MyAccount");
                                    });
                                })
                                .catch(err => {
                                    console.log("Error", err)
                                    this.refs.toast.show('Error en los Campos Del Registro, Prueba de Nuevo', 1500);
                                })
                        }
                    }
                    else {
                        this.setState({
                            formErrorMessage: "No coinciden las Contraseñas"
                        });
                    }
                }
                else {
                    this.setState({
                        formErrorMessage: "Contraseña debe Tener mas de 5 Caracteres"
                    });
                }
            }
            else {
                this.setState({
                    formErrorMessage: "Correo Invalido"
                });
            }
        } else {
            this.setState({
                formErrorMessage: "Todos los Campos Obligatorios"
            });
        }
    };

    onChangeRegister = (formValue) => {
        this.setState({
            formData: formValue
        });
    }


    render() {
        const { registerStruct, registerOptions, formErrorMessage } = this.state;

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
                        ref="registerForm"
                        type={registerStruct}
                        options={registerOptions}
                        value={this.state.formData}
                        onChange={(formValue) => this.onChangeRegister(formValue)}
                    />
                    <Button buttonStyle={styles.registerButton} title="Unirme" onPress={() => this.register()} />
                    <Text style={styles.formErrorMessage} >{formErrorMessage}</Text>
                    <Toast
                        ref="toast"
                        position="bottom"
                        positionValue={200}
                        fadeInDuration={500}
                        fadeOutDuration={500}
                        opacity={0.8}
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
        padding: 30
    },
    logo: {
        width: "100%",
        height: 175,
        marginBottom: 30
    },
    registerButton: {
        backgroundColor: "#00a680",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    formErrorMessage: {
        color: "#f00",
        textAlign: "center",
        marginTop: 30
    }
});