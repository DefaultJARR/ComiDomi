import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import { firebaseApp } from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Restaurants extends Component {

    constructor() {
        super();
        this.state = {
            login: false,
            restaurants: null, // Array de Restaurantes
            startRestaurants: null, // Restaurantes a utlizar
            limitRestaurants: 8 // limite de cantidad de restaurantes a traer de la base de Datos
        }
    }

    componentDidMount() {
        this.checkLogin();
        this.loadRestaurants();
    }

    // valida si hay usuario logueado y modifica el state.login
    checkLogin = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ login: true });
            }
            else {
                this.setState({ login: false });
            }
        });

    }

    goToScreen = nameScreen => {
        this.props.navigation.navigate(nameScreen)
    }

    // muestra el Action Button
    showActionButton = () => {
        const { login } = this.state;

        if (login) {
            return (
                <ActionButton buttonColor="#00a680">
                    <ActionButton.Item buttonColor='#9b59b6' title="Crear Restaurante" onPress={() => this.goToScreen("AddRestaurant")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            )
        }
    }

    // trae los restaurantes de la Base de datos
    loadRestaurants = async () => {
        const { limitRestaurants } = this.state;
        let resultRestaurants = [];

        const restaurants = db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurants);

        await restaurants.get()
            .then(response => {
                this.setState({ startRestaurants: response.docs[response.docs.length - 1] })

                response.forEach(doc => {
                    let restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push({ restaurant });
                });

                this.setState({ restaurants: resultRestaurants });
            })

        console.log("Wooooooow: \n", this.state.restaurants);

    }

    render() {
        return (
            <View style={styles.viewBody}>
                <Text>Restaurants Screen...</Text>
                {this.showActionButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    }
});