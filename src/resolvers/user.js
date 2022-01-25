module.exports = {
    //Return of all user notes
    notes: async(user,args,{models})=>{
        return await models.Note.find({author: user._id}).sort({_id: -1})
    },
    //Return of user favorited notes
    favorites: async(user,args,{models})=>{
        return await models.Note.find({favoritedBy: user._id}).sort({_id: -1})
    }
}