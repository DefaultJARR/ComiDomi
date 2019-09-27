import React from 'react';
import { Icon } from 'react-native-elements';
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator
} from 'react-navigation';

// Screens para los Stacks
// Screens HomeStack
import HomeScreen from '../screens/Home';

// Screens SearchStack
import SearchScreen from '../screens/Search';

// Screens TopFiveStack
import TopFiveScreen from '../screens/TopFive';

// Screens MyAccountStack
import MyAccountScreen from '../screens/MyAccount/MyAccount';
import RegisterScreen from '../screens/MyAccount/Register';
import LoginScreen from '../screens/MyAccount/Login';


// Stacks
const homeStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Home"
        })
    }
});

const searchStack = createStackNavigator({
    Search: {
        screen: SearchScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Buscar"
        })
    }
});

const topFivestack = createStackNavigator({
    TopFive: {
        screen: TopFiveScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Top Cinco Restaurantes"
        })
    }
});

const myAccountStack = createStackNavigator({
    MyAccount: {
        screen: MyAccountScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Mi Cuenta"
        })
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: ({ navigate }) => ({
            title: "Registro"
        })
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Login"
        })
    }
});

const iconSize = 25;
const RootStack = createBottomTabNavigator({
    Home: {
        screen: homeStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "HomeTab",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    type="material-community"
                    name="compass-outline"
                    size={iconSize}
                    color={tintColor}
                />
            )
        })
    },
    TopFive: {
        screen: topFivestack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Top 5",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    type="material-community"
                    name="star-outline"
                    size={iconSize}
                    color={tintColor}
                />
            )
        })
    },
    Search: {
        screen: searchStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Buscar",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    type="material-community"
                    name="magnify"
                    size={iconSize}
                    color={tintColor}
                />
            )
        })
    },
    MyAccount: {
        screen: myAccountStack,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: "Mi Cuenta",
            tabBarIcon: ({ tintColor }) => (
                <Icon
                    type="material-community"
                    name="home-outline"
                    size={iconSize}
                    color={tintColor}
                />
            )
        })
    }
}, {
    initialRouteName: "MyAccount",
    order: ["Home", "Search", "TopFive", "MyAccount"], // Para Ordenar Los Elementos del Menú
    tabBarOptions: {
        inactiveTintColor: "#646464",
        activeTintColor: "#00a680"
    }
});


export default createAppContainer(RootStack);