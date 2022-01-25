const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        color: {
            type: Number,
            required: true,
            default: 1
        },
        title: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        favoriteCount: {
            type: Number,
            default: 0
        },
        favoritedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        timestamps: true
    }
    
);

//defining Note model with noteSchema
const Note = mongoose.model('Note', noteSchema)

module.exports = Note;