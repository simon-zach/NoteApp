const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
    
);

//Zdefiniowanie modelu Note ze schematem
const Note = mongoose.model('Note', noteSchema)

module.exports = Note;