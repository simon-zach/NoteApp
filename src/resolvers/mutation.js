
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   const {
       AuthenticationError,
       ForbiddenError
   } = require('apollo-server-express');
   require('dotenv').config();

   const gravatar = require('../util/gravatar')


module.exports = {
    newNote: async (parent, args,{models}) => {
        return await models.Note.create({
        content: args.content,
        author: 'Simon Zach'
    })
    },
    deleteNote: async (parent, {id}, {models}) => {
         
        try{
            await models.Note.findOneAndRemove({_id: id})
            return true;
        }catch (err){
            return false;
        }
        
    },

    updateNote: async (parent, {content,id}, {models}) => {   
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
        //console.log(user)
        //user not found
        if(!user){
            throw new AuthenticationError('Błąd podczas uwierzytelniania')
        }

        const valid = await bcrypt.compare(password,user.password)
        console.log(valid)
        if(!valid){
            throw new AuthenticationError('Błąd podczas uwierzytelniania')
        }

        //Creation token and return
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    }

  

}
  