import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, ActivityIndicator, ActivityIndicatorBase } from 'react-native';
import { Icon, Image, Button, Text, Overlay } from 'react-native-elements';
import * as Permissions from 'expo-permissions' // Para solicitar los permisos del dispositivo
import Toast, { DURATION } from 'react-native-easy-toast';
import * as ImagePicker from 'expo-image-picker'; // Seleccionador de Imagenes

// Firebase
import firebaseApp from '../../utils/FireBase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

// Tcomb
import t from 'tcomb-form-native';
const Form = t.form.Form;
// Formulrio
import { AddRestaurantStruct, AddRestaurantOptions } from '../../forms/AddRestaurant'

// Funcion de "Utils" para la Carga de Imagenes
import { uploadImage } from '../../utils/UploadImage'
export default class AddRestaurant extends Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            imageUriRestaurant: "",
            formData: {
                name: "",
                city: "",
                address: "",
                description: ""
            }
        }
    }

    onChangeAddRestaurantForm = formValue => {
        this.setState({
            formData: formValue
        });
    }

    // Carga la Imagen del Restaurante
    isImageRestaurant = image => {
        if (!image) {
            return (
                <Image
                    source={require("../../../assets/img/no-image-icon-11.png")}
                    style={{ width: 230, height: 200 }}
                />
            );
        }
        else {
            return (
                <Image
                    source={{ uri: image }}
                    style={{ width: 500, height: 200 }}
                />
            );
        }
    }

    // Permite Seleccionar y cargar una imagen de la Galeria en el State
    uploadImage = async () => {
        // Pedir Permisos
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (resultPermission.status === "denied") {
            this.refs.toast.show("Permisos de galeria Denegados", 750);
        }
        else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEdit: true,
            });

            if (result.cancelled) {
                this.refs.toast.show("Has Cerrado la Galeria", 750)
            }
            else {
                this.setState({
                    imageUriRestaurant: result.uri
                });
            }
        }
    }

    addRestaurant = () => {
        const { imageUriRestaurant } = this.state;
        const { name, city, address, description, date } = this.state.formData;

        if (imageUriRestaurant && name && city && address && description) {
            this.setState({ loading: true })
            db.collection("restaurants").add({ image: "", name, city, address, description, createAt: new Date() })
                .then(resolve => {
                    const restaurantId = resolve.id;
                    uploadImage(imageUriRestaurant, restaurantId, "restaurants")
                        .then(resolve => {
                            const restaurantRef = db
                                .collection("restaurants")
                                .doc(restaurantId);

                            restaurantRef.update({ image: resolve })
                                .then(() => {
                                    this.setState({ loading: false })
                                    this.refs.toast.show("Restaurante Creado Correctamente", 750, () => {
                                        this.props.navigation.goBack()
                                    });
                                })
                                .catch(err => {
                                    this.setState({ loading: false })
                                    this.refs.toast.show("Error de Servidor, Intentelo mas tarde", 750);
                                })
                        })
                        .catch(err => {
                            this.setState({ loading: false })
                            this.refs.toast.show("Error de Servidor, Intentelo mas tarde", 750);
                        });
                })
                .catch(err => {
                    this.setState({ loading: false })
                    this.refs.toast.show("Error de Servidor, Intentelo mas tarde", 750);
                })
        }
        else {
            this.refs.toast.show("Imagen y Campos Obligatorios");
        }

        // uploadImage(imageUriRestaurant, 'mifotorest', "restaurants")
        //     .then(() => {
        //         console.log("Todo Correcto");
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    render() {
        const { imageUriRestaurant, loading } = this.state

        return (
            <ScrollView>
                <View style={styles.viewBody}>
                    <View style={styles.viewPhoto}>
                        {this.isImageRestaurant(imageUriRestaurant)}
                    </View>
                    <View style={styles.viewUploadPhoto}>
                        <Icon
                            iconStyle={styles.addPhotoIcon}
                            name="camera"
                            type="material-community"
                            color="#7A7A7A"
                            onPress={() => this.uploadImage()}
                        />
                    </View>
                    <View>
                        <Form
                            ref="addRestaurantForm"
                            type={AddRestaurantStruct}
                            options={AddRestaurantOptions}
                            value={this.state.formData}
                            onChange={formValue => this.onChangeAddRestaurantForm(formValue)}
                        />
                    </View>
                    <View style={styles.viewBtnAddRestaurant}>
                        <Button
                            buttonStyle={styles.btnAddRestaurant}
                            title="Crear Restaurante"
                            onPress={() => this.addRestaurant()}
                        />
                    </View>
                    <Toast
                        ref="toast"
                        position="bottom"
                        positionValue={320}
                        fadeInDuration={750}
                        fadeOutDuration={750}
                        opacity={0.8}
                        textStyle={{ color: "#fff" }}
                    />

                    <View>
                        <Overlay
                            overlayStyle={styles.overlayLoading}
                            isVisible={loading}
                            width="auto"
                            height="auto"
                        >
                            <View>
                                <Text style={styles.loadingText}>Creando Restaurante</Text>
                                <ActivityIndicator size="large" color="#00a680" />
                            </View>
                        </Overlay>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    viewUploadPhoto: {
        flex: 1,
        alignItems: "center", // Se va al inicio o a la parte izquierda de su contenedor
    },
    addPhotoIcon: {
        backgroundColor: "#e3e3e3",
        padding: 17,
        paddingBottom: 14,
        margin: 0
    },
    viewBtnAddRestaurant: {
        flex: 1,
        justifyContent: "flex-end"
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    overlayLoading: {
        padding: 20
    },
    loadingText: {
        color: "#00a680",
        marginBottom: 20,
        fontSize: 20
    }
})