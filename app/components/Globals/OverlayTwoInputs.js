import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Overlay, Input, Button, Text, Icon } from 'react-native-elements'

export default class OverlayTwoInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props,
            actualEmail: this.props.inputValueOne
        }
    }

    onChangeInputOne = inputData => {
        this.setState({
            inputValueOne: inputData
        });
    }
    onChangeInputTwo = inputData => {
        this.setState({
            inputValueTwo: inputData
        });
    }

    updateUserEmail = () => {
        const newValueOne = this.state.inputValueOne;
        const newValueTwo = this.state.inputValueTwo;

        this.state.updateUserEmail(newValueOne, newValueTwo);

        this.setState({ isVisible: false });
    }

    closeOverlay = () => {
        const actualEmail = this.state.actualEmail;
        this.setState({ isVisible: false });
        this.state.updateUserEmail(actualEmail, "");
    }

    render() {
        const { isVisible, placeholderOne, placeholderTwo, inputValueOne, inputValueTwo } = this.state;

        return (
            <Overlay
                isVisible={isVisible}
                overlayBackgroundColor="transparent"
                overlayStyle={styles.overlay}
                // onBackdropPress={() => {}} funcion para ejecutar  algo cuando se hace touch fuera del Overlay
                fullScreen={true}
            >
                <View style={styles.viewOverlay}>
                    <Input
                        containerStyle={styles.inputOverlay}
                        placeholder={placeholderOne}
                        onChangeText={val => this.onChangeInputOne(val)}
                        value={inputValueOne}
                    />
                    <Input
                        containerStyle={styles.inputOverlay}
                        placeholder={placeholderTwo}
                        onChangeText={val => this.onChangeInputTwo(val)}
                        value={inputValueTwo}
                        password={this.state.password}
                        secureTextEntry={this.state.password}
                    />
                    <Button
                        buttonStyle={styles.buttonOverlay}
                        title="Actualizar"
                        onPress={() => this.updateUserEmail()}
                    />
                    <Icon
                        type="material-community"
                        name="close-circle-outline"
                        containerStyle={styles.containerIconClose}
                        size={30}
                        color="#ccc"
                        onPress={() => this.closeOverlay()}
                    />
                </View>
            </Overlay>
        );
    }

}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    viewOverlay: {
        width: "85%",
        backgroundColor: "white",
        padding: 20,
        borderColor: "#00a680",
        borderTopWidth: 10,
        borderBottomWidth: 10,
    },
    inputOverlay: {
        marginBottom: 20,
    },
    buttonOverlay: {
        backgroundColor: "#00a680"
    },
    containerIconClose: {
        position: "absolute",
        right: 0,
        top: 0
    }
});