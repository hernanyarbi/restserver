const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El emiail es necesario.']
    },
    password: {
        type: String,
        required: [true, 'La conraseña es necesaria.']
    },
    img:{
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;
    return userObjet
}

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'})

module.exports = mongoose.model('Users', userSchema);