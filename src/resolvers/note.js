

module.exports = {
    //Return of author data in note data
    author: async (note, args, {models}) => {
        return await models.User.findById(note.author)
    },

    //return of favorited by data in note data
    favoritedBy: async (note, args, {models}) => {
        return await models.User.find({_id: {$in: note.favoritedBy} })
    }

}