import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon } from 'react-native-elements';

// locals toma los valores de la porpiedad config que viene en el "Objeto-Options" que usa el template 
export default (inputTemplate = locals => {
    return (
        <View style={styles.viewContainer}>
            <Input
                placeholder={locals.config.placeholder}
                password={locals.config.password}
                secureTextEntry={locals.config.secureTextEntry}
                rightIcon={
                    <Icon
                        type={locals.config.icon.type}
                        name={locals.config.icon.name}
                        size={30}
                        color={locals.config.icon.color}
                    />
                }
                onChangeText={value => locals.onChange(value)}
            />
        </View>
    )
});

const styles = StyleSheet.create({
    viewContainer: {
        marginTop: 12,
        marginBottom: 12
    }
});