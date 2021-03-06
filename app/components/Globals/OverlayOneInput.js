import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Overlay, Input, Button, Text, Icon } from 'react-native-elements'

export default class OverlayOneInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props
        }
    }

    onChangeInput = inputData => {
        this.setState({
            inputValue: inputData
        });
    }

    updateUserName = () => {
        this.state.updateUserName(this.state.inputValue);
        this.setState({ isVisible: false });
    }

    closeOverlay = () => {
        this.setState({ isVisible: false });
        this.state.updateUserName(null);
    }

    render() {
        const { isVisible, placeholder, inputValue, updateUserName } = this.state;

        return (
            <Overlay
                isVisible={isVisible}
                overlayBackgroundColor="transparent"
                overlayStyle={styles.overlay}
                // onBackdropPress={() => {}} funcion para ejecutar algo cuando se hace touch fuera del Overlay
                fullScreen={true}
            >
                <View style={styles.viewOverlay}>
                    <Input
                        containerStyle={styles.inputOverlay}
                        placeholder={placeholder}
                        onChangeText={val => this.onChangeInput(val)}
                        value={inputValue}
                    />
                    <Button
                        buttonStyle={styles.buttonOverlay}
                        title="Actualizar"
                        onPress={() => this.updateUserName()}
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