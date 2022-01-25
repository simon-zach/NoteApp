const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: {unique: true}
        },
        email:{
            type: String,
            required: true,
            index: {unique: true}
        },
        password:{
            type: String,
            required: true,
        },
        avatar:{
            type: String
        }
    },
    {
        timesstamps: true
    }
    
);

//Defining user model with UserSchema
const User = mongoose.model('User', UserSchema)

module.exports = User;