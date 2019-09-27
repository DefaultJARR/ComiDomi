import React, { Component } from 'react';
import t from 'tcomb-form-native';

import formValidation from '../utils/Validations';
import inputTemplate from './templates/Input';


export const LoginStruct = t.struct({
    email: formValidation.email,
    password: formValidation.password
});

export const LoginOptions = {
    fields: {
        email: {
            template: inputTemplate,
            config: {
                placeholder: "Nombre de Usuario o Email",
                icon: {
                    type: "material-community",
                    name: "at",
                    color: "black"
                }
            }
        },
        password: {
            template: inputTemplate,
            config: {
                placeholder: "Contraseña",
                password: true,
                secureTextEntry: true,
                icon: {
                    type: "material-community",
                    name: "lock-outline",
                    color: "black"
                }
            }
        }
    }
}