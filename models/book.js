const {Schema, model} = require('mongoose');


const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    genre: {
        type: String,
        enum: ['fantastic', 'adventure', 'love'],
        required: true,
    },
    date: {
        type: String,
        // !16-10-2009
        match: /^\d{2}-\d{2}-\d{4}$/,
        required: true,

    }
})


const Book = model('book', bookSchema);

module.exports = Book;