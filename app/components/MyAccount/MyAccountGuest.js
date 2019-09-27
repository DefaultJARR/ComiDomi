import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, ScrollView } from 'react-native';
import { Button, Text, Image } from 'react-native-elements';

import Constants from 'expo-constants'; // para el ScrollView

export default class MyAccountGuest extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        return (
            <View style={styles.viewBody}>
                <Image
                    source={require("../../../assets/img/image-my-account-guest-01.jpg")}
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator />}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Consulta tu Perfil de ComiDomi</Text>
                <Text style={styles.description}>
                    ¿Como describirías tu mejor restaurante? Busca y encuentra los mejores
                    restaurantes de una forma sencilla, vota cual te ha gustado más y
                    comenta como ha sido tu experiencia.
                    </Text>
                <Button buttonStyle={styles.btnViewProfile} title="Ver tu Perfil" onPress={() => props.changeScreen("Login")} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        marginHorizontal: 30,
        // borderWidth: 1,
        // borderColor: "black"
    },
    image: {
        height: 305,
        marginTop: 20
    },
    title: {
        fontWeight: "bold",
        fontSize: 21,
        marginBottom: 10
    },
    description: {
        textAlign: "center",
        marginBottom: 20
    },
    btnViewProfile: {
        width: "100%",
        backgroundColor: "#00a680"
    }
})