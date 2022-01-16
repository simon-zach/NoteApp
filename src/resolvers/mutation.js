
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {AuthenticationError,ForbiddenError} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar')
const mongoose = require('mongoose')

module.exports = {
    newNote: async (parent, args,{models, user}) => {
        if (!user){
            throw new AuthenticationError('Tylko zalogowani użytkownicy mogą tworzyć notatki')
        }
        return await models.Note.create({
        content: args.content,
        //Odwołanie do identyfikatora uzytkownika
        author: mongoose.Types.ObjectId(user.id)
        })
    },
    deleteNote: async (parent, {id}, {models,user}) => {
        if (!user){
            throw new AuthenticationError('Tylko zalogowani użytkownicy mogą usuwac notatki')
        }
        //odszukanie notatki
        const note = await models.Note.findById(id)
        //console.log(note.author)
        //console.log(user.id)
       // console.log(note)
       //console.log(String(note.author))
       // console.log(note && String(note.author))

        if(note && String(note.author) !== user.id){
            throw new ForbiddenError('Nie masz uprawnien do notatki')
        }

        try{
            //await models.Note.findOneAndRemove({_id: id})
            await note.remove();
            return true;
        }catch (err){
            return false;
        }
    },

    updateNote: async (parent, {content,id}, {models,user}) => {   
        if (!user){
            throw new AuthenticationError('Tylko zalogowani użytkownicy mogą usuwac notatki')
        }

        const note = await models.Note.findById(id)

        if(note && String(note.author) !== user.id){
            throw new ForbiddenError("Nie masz uprawnien do uaktualnienia notatki")
        }

            return await models.Note.findOneAndUpdate(
                {
                    _id: id
                },
                {
                    $set: {
                        content
                    }
                },
            );
    },
    signUp: async (parent, {username,email,password}, {models})=>{

        //Trim usuwa spacje
        email = email.trim().toLowerCase()
        //Utworzenie warttosci hash na podstawie hasla
        const hashed = await bcrypt.hash(password,10)
        //Utworzenie adresu URL gravatar
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
            console.log(err)
            throw new Error('Błąd podczas tworzenia konta')
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
            throw new AuthenticationError('Błąd podczas uwierzytelniania.')
        }

        const valid = await bcrypt.compare(password,user.password)
        //console.log(valid)
        if(!valid){
            throw new AuthenticationError('Błąd podczas uwierzytelniania')
        }

        //Creation token and return
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    },
    toggleFavorite: async (parent, { id}, {models,user})=>{
        if (!user){
            throw AuthenticationError("Użytkownik musi być zalogowany")
        }

        const note = await models.Note.findById(id);
        //czy uzytkownik który chce toglowac jest pod tą notatka
        const hasUser = note.favoritedBy.indexOf(user.id);

        //Jezeli uzytkownik jest na liscie to trzeba go usunac z listy
        if (hasUser >= 0){
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)//usuwa tego uzytkownika z favoriteBy
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    new: true //zwraca uaktualniona notatke
                }
            );
        } else {// jezeli nie ma uzytkownika postepujemy na odwrót
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)//usuwa tego uzytkownika z favoriteBy
                    },
                    $inc: {
                        favoriteCount: +1
                    }
                },
                {
                    new: true //zwraca uaktualniona notatke
                }
            );
        }


    }
  

}
  