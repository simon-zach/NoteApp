module.exports = {
    //pobranie wszystkich notatek uzytkownika
    notes: async(user,args,{models})=>{
        return await models.Note.find({author: user._id}).sort({_id: -1})
    },
    //Pobranie listy ulubionych notatek użytkownika
    favorites: async(user,args,{models})=>{
        return await models.Note.find({favoritedBy: user._id}).sort({_id: -1})
    }
}