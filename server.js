const mongoose = require('mongoose');

const app = require('./app')

// const DB_HOST = 'mongodb+srv://Oleg:XEBd7NEhKAnkCREp@cluster0.3z6iy0y.mongodb.net/books_reader?retryWrites=true&w=majority'

const {DB_HOST} = process.env

mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST).then(app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})).catch(error => {
  console.log(error.message);
  process.exit(1);
})

console.log(process.env);


