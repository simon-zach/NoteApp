
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {AuthenticationError,ForbiddenError} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar')
const mongoose = require('mongoose')

module.exports = {
    newNote: async (parent, args,{models, user}) => {
        if (!user){
            throw new AuthenticationError('Only logged users can create notes')
        }
        return await models.Note.create({
        content: args.content,
        title: args.title,
        color: args.color,
        //author is user
        author: mongoose.Types.ObjectId(user.id)
        })
    },
    deleteNote: async (parent, {id}, {models,user}) => {
        if (!user){
            throw new AuthenticationError('Only loged users can delete notes')
        }
        //finding note
        const note = await models.Note.findById(id)

        if(note && String(note.author) !== user.id){
            throw new ForbiddenError('You have no access to note')
        }

        try{
            await note.remove();
            return true;
        }catch (err){
            return false;
        }
    },

    updateNote: async (parent, {content,id,title,color}, {models,user}) => {   
        if (!user){
            throw new AuthenticationError('Only logged user can delete notes')
        }

        const note = await models.Note.findById(id)

        if(note && String(note.author) !== user.id){
            throw new ForbiddenError("You have no permission to update note")
        }

            return await models.Note.findOneAndUpdate(
                {
                    _id: id
                },
                {
                    $set: {
                        content,
                        title,
                        color
                    }
                },
            );
    },
    signUp: async (parent, {username,email,password}, {models})=>{

        //Trim deleteig white spaces
        email = email.trim().toLowerCase()
        //Creating hash value from password 
        const hashed = await bcrypt.hash(password,10)
        //Creating URL adress of gravatar
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            })
            //creation and token return
            return jwt.sign({id: user._id}, process.env.JWT_SECRET);
        }catch(err){
            throw new Error('Error during account creation')
        }
        
    },
    signIn: async (parent, {username,email,password},{models}) => {
        if (email){
            email = email.trim().toLowerCase()
        }
        const user = await models.User.findOne({
            $or: [{email},{username}]
        });
  
        //user not found
        if(!user){
            throw new AuthenticationError('Error during authentication')
        }

        const valid = await bcrypt.compare(password,user.password)
        if(!valid){
            throw new AuthenticationError('Error during authentication')
        }

        //Creation token and return
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    },
    toggleFavorite: async (parent, { id}, {models,user})=>{
        if (!user){
            throw AuthenticationError("User must be logged")
        }

        const note = await models.Note.findById(id);
        //is user added to note already
        const hasUser = note.favoritedBy.indexOf(user.id);

        //If user is on list has to be romoved
        if (hasUser >= 0){
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)//removing user from favoritedBy
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true //returning updated note
                }
            );
        } else {
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)//adding user to favorited by
                    },
                    $inc: {
                        favoriteCount: +1
                    }
                },
                {
                    new: true //returnig updated note
                }
            );
        }


    }
  

}
  