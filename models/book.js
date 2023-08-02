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
    // !Другий об'єкт в схемі прибирає версію та встановлює дату додавання та оновлення
}, {versionKey: false, timestamps: true})  


// !Щоб статус викидав при помилці
bookSchema.post('save', (error, data, next) => {
    error.status = 400;
    next();
})


const Book = model('book', bookSchema);

module.exports = Book;