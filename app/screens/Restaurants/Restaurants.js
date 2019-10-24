import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedbackBase } from 'react-native';
import { Image } from 'react-native-elements';

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
            limitRestaurants: 8, // limite de cantidad de restaurantes a traer de la base de Datos
            isLoading: true // Indica la carga de Restaurantes
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

    }

    // s
    handleLoadMore = async () => {
        console.log("GASDGADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

        const { restaurants, limitRestaurants, startRestaurants } = this.state;
        let resultrestaurants = restaurants;

        const restaurantsDB = db.collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurants.data().createAt)
            .limit(limitRestaurants);

        await restaurantsDB.get()
            .then(response => {
                response.forEach(doc => {
                    console.log(doc.data);
                });
            })
    }

    renderRow = restaurant => {
        const { name, city, address, description, image } = restaurant.item.restaurant;

        return (
            <TouchableOpacity onPress={() => this.clickRestaurant(restaurant)}>
                <View style={styles.viewRestaurantItem}>
                    <View style={styles.viewImageRestaurantItem}>
                        <Image
                            resizeMode="cover"
                            source={{ uri: image }}
                            style={styles.imageRestaurantItem}
                        />
                    </View>
                    <View>
                        <Text style={styles.flatListRestaurantName}>{name}</Text>
                        <Text style={styles.flatListRestaurantAddress}>
                            {city}, {address}
                        </Text>
                        <Text style={styles.flatListRestaurantDescription}>
                            {description.substr(0, 60)}...
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderFooter = () => {
        if (this.state.isLoading) {
            return (
                <View style={styles.viewLoaderRestaurants}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        else {
            return (
                <View style={styles.viewNotFoundRestaurants}>
                    <Text>No quedan Restaurantes por Cargar</Text>
                </View>
            );
        }
    }

    renderFlatList = restaurants => {
        if (restaurants) {
            return (
                <FlatList
                    data={this.state.restaurants}
                    renderItem={this.renderRow}
                    initialNumToRender={this.state.limitRestaurants}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.handleLoadMore()}
                    onEndReachedThreshold={-1}
                    ListFooterComponent={this.renderFooter}
                />
            )
        }
        else {
            return (
                <View style={styles.loadingRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando Restaurantes</Text>
                </View>
            )
        }
    }

    clickRestaurant = restaurant => {
        console.log("Click en el Restaurante: ");
        console.log(restaurant);
    }

    render() {
        const { restaurants } = this.state;

        return (
            <View style={styles.viewBody}>
                {this.renderFlatList(restaurants)}
                {this.showActionButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    loadingRestaurants: {
        marginTop: 20,
        alignItems: "center"
    },
    viewRestaurantItem: {
        flexDirection: "row",
        margin: 10
    },
    viewImageRestaurantItem: {
        marginRight: 15
    },
    imageRestaurantItem: {
        width: 80,
        height: 80
    },
    flatListRestaurantName: {
        fontWeight: "bold"
    },
    flatListRestaurantAddress: {
        paddingTop: 2,
        color: "gray"
    },
    flatListRestaurantDescription: {
        paddingTop: 2,
        color: "gray",
        width: 250
    },
    viewLoaderRestaurants: {
        marginTop: 15,
        marginBottom: 15
    },
    viewNotFoundRestaurants: {
        marginVertical: 15,
        alignItems: "center"
    }
});