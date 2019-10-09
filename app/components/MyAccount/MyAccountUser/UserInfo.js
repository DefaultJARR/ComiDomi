import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Avatar } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Permissions from 'expo-permissions' // Para solicitar los permisos del dispositivo
import * as ImagePicker from 'expo-image-picker'; // Seleccionador de Imagenes

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

    // Valida si la información del Usuario coincide con la almacenada en la DB
    reauthenticate = currentPassword => {
        const user = firebase.auth().currentUser;
        const credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        )
        return user.reauthenticateWithCredential(credentials);
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

    // Modifica en Firebase el Email del Usuario
    updateUserEmail = async (newEmail, newPassword) => {
        this.reauthenticate(newPassword)
            .then(() => {
                const user = firebase.auth().currentUser;
                user.updateEmail(newEmail)
                    .then(() => {
                        console.log("Email cambiado Correctamente");
                        this.refs.toast.show("Email Cambiado Correctamente, vuelve a hacer login por favor", 1500, () => {
                            firebase.auth().signOut();
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            .catch(err => {
                console.log("Tu contraseña no es Correcta");
                this.refs.toast.show("Tu Contraseña no es Correcta", 1500);
            })

    }

    // Modifica en Firebase el Avatar del Usuario // Se envia por atributos a "UpdateUserInfo"
    updateUserPhotoURL = async photoUri => {
        const update = {
            photoURL: photoUri
        }
        await firebase.auth().currentUser.updateProfile(update);
        this.getUserInfo()
    }

    // Modifica en Firebase el Password del Usuario
    updateUserPassword = async (actualPassword, newPassword) => {
        console.log("ASDASD: ", actualPassword);

        this.reauthenticate(actualPassword)
            .then(() => {
                const user = firebase.auth().currentUser;

                user.updatePassword(newPassword)
                    .then(() => {
                        this.refs.toast.show("Contraseña Actualizada Correctamente, Vuelve a Iniciar Sesion", 1000, () => {
                            firebase.auth().signOut();
                        });
                    })
                    .catch(() => {
                        this.refs.toast.show("Error del Servidor o Tu conexión a Internet, intentalo mas tarde");
                    })

            })
            .catch(err => {
                this.refs.toast.show("La contraseña Introducida no es Correcta");
                console.log("error: ", err);

            })
    }

    // Valida si ya se Cargó al State la información del Usuario desde Firebase, para empezar a cargar al ListItem de "UpdateUserInfo"
    returnUpdateUserInfoComponent = userInfoData => {
        if (userInfoData.hasOwnProperty("uid")) {
            return (
                <UpdateUserInfo
                    userInfo={this.state.userInfo}
                    updateUserName={this.updateUserName}
                    updateUserEmail={this.updateUserEmail}
                    updateUserPassword={this.updateUserPassword}
                />
            )
        }
    }

    changeAvatarUser = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (resultPermission.status === "denied") {
            this.refs.toast.show("Permisos Denegados", 1500);
        }
        else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [3, 3]
            });
            if (result.cancelled) {
                this.refs.toast.show("Ninguna Imagen Seleccionada", 1500);
            }
            else {
                const { uid } = this.state.userInfo;
                this.uploadImage(result.uri, uid)
                    .then(resolve => {
                        firebase.storage().ref("avatar/" + uid).getDownloadURL()
                            .then(resolve => {
                                this.updateUserPhotoURL(resolve);
                            })
                            .catch(err => {
                                console.log("Error al Recuperar: ", err)
                                this.refs.toast.show("Error al Recuperar el Avatar", 1500);
                            })
                    })
                    .catch(err => {
                        this.refs.toast.show("Error al Actualizar el Avatar Intentelo mas Tarde");
                    })
            }

        }
    }

    uploadImage = async (uri, imageName) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onerror = reject;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.response);
                }
            }

            xhr.open("GET", uri);
            xhr.responseType = "blob";
            xhr.send();
        }) // Promesa
            .then(async resolve => {
                let ref = firebase.storage().ref().child("avatar/" + imageName);
                return await ref.put(resolve);
            })
            .catch(err => {
                this.refs.toast.show("Error Al Subir la Imagen al Sevidor", 1500);
            })
    }

    render() {
        const { displayName, email, photoURL } = this.state.userInfo;

        return (
            <View>
                <View style={styles.viewBody}>
                    <Avatar
                        rounded
                        size="large"
                        showEditButton
                        onEditPress={() => this.changeAvatarUser()}
                        source={{ uri: this.checkUserAvatar(photoURL) }}
                        containerStyle={styles.userAvatar}
                    />
                    <View style={styles.viewUserInfo}>
                        <Text style={styles.userName}>{displayName}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>
                </View>
                {this.returnUpdateUserInfoComponent(this.state.userInfo)}
                <Toast
                    ref="toast"
                    position="bottom"
                    positionValue={250}
                    fadeInDuration={500}
                    fadeOutDuration={500}
                    opacity={0.8}
                    containerStyle={{ justifyContent: 'center', alignContent: 'center' }}
                    textStyle={{ color: "#fff" }}
                />
            </View>

        );
    }

}

const styles = StyleSheet.create({
    viewBody: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row", // Para que todo lo que esté en el view no se comporte como display: BLOCK
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
    }
});
