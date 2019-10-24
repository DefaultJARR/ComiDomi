import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native';
import { Input, Icon } from 'react-native-elements';

export default (Textarea = locals => {
    return (
        <View style={styles.viewContainer}>
            <Input
                inputContainerStyle={styles.inputContainer}
                placeholder={locals.config.placeholder}
                multiline={true}
                onChangeText={value => locals.onChange(value)}
            />
        </View>
    );
})

const styles = StyleSheet.create({
    viewContainer: {
        margin: 12,
        height: 50,
        width: "100%"
    },
    inputContainer: {
        position: "absolute",
        height: 50,
        width: "100%",
        padding: 0,
        margin: 0
    }
})