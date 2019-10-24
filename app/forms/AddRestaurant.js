import t from 'tcomb-form-native';
import InputTemplate from './templates/Input'
import TextareaTemplate from './templates/Textarea'

export const AddRestaurantStruct = t.struct({

    name: t.String,
    city: t.String,
    address: t.String,
    description: t.String

})

export const AddRestaurantOptions = {

    fields: {
        name: {
            template: InputTemplate,
            config: {
                placeholder: "Nombre del Restaurante",
                icon: {
                    type: "material-community",
                    name: "silverware",
                    color: "black"
                }
            }
        },
        city: {
            template: inputTemplate,
            config: {
                placeholder: "Ciudad",
                icon: {
                    type: "material-community",
                    name: "city",
                    color: "black"
                }
            }
        },
        address: {
            template: inputTemplate,
            config: {
                placeholder: "Dirección del Restaurante",
                icon: {
                    type: "material-community",
                    name: "map-marker",
                    color: "black"
                }
            }
        },
        description: {
            template: TextareaTemplate,
            config: {
                placeholder: "Descripción del Restaurante",
                icon: {
                    type: "material-community",
                    name: "at",
                    color: "black"
                }
            }
        }
    }

}