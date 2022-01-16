const { models } = require("mongoose")

module.exports = {
    //zwracanie authora kiedy pobieramy notatke
    author: async (note, args, {models}) => {
        return await models.User.findById(note.author)
    },

    //pobranie favoritedBy podczas pobierania notatki
    favoritedBy: async (note, args, {models}) => {
        return await models.User.find({_id: {$in: note.favoritedBy} })
    }

}