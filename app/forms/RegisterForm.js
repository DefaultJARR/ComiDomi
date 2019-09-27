import React from 'react';
import t from 'tcomb-form-native';
import formValidation from '../utils/Validations'
import inputTemplate from './templates/Input'

export const RegisterStruct = t.struct({
    name: t.String,
    email: formValidation.email,
    password: formValidation.password,
    passwordConfirm: formValidation.password
});

export const RegisterOptions = {
    fields: {
        name: {
            template: inputTemplate,
            config: {
                placeholder: "Nombres y Apellidos",
                icon: {
                    type: "material-community",
                    name: "account-outline",
                    color: "black"
                }
            }
        },
        email: {
            template: inputTemplate,
            config: {
                placeholder: "Digita tu Email",
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
                placeholder: "Crea tu Contraseña",
                password: true,
                secureTextEntry: true,
                icon: {
                    type: "material-community",
                    name: "lock-outline",
                    color: "black"
                }
            }
        },
        passwordConfirm: {
            template: inputTemplate,
            config: {
                placeholder: "Repite tu Contraseña",
                password: true,
                secureTextEntry: true,
                icon: {
                    type: "material-community",
                    name: "lock-reset",
                    color: "black"
                }
            }
        }

    }
}