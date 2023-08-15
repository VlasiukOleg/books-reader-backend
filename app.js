const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv');

const authRouter = require('./routes/api/auth')
const contactsRouter = require('./routes/api/contacts')

dotenv.config();

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

// ! Дозволяє брати статичні файли з папки яку вкажемо
app.use(express.static('public'));


app.use('/api/auth', authRouter)
app.use('/api/contacts', contactsRouter)



// !nodemailer
// const nodemailer = require('nodemailer');

// const {META_PASSWORD} = process.env;
// console.log(META_PASSWORD);

// const nodeMailerConfig = {
//   host: 'smtp.meta.ua',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'vlasiuk.oleg.dev@meta.ua',
//     pass: META_PASSWORD
//   }
// }

// const transporter = nodemailer.createTransport(nodeMailerConfig);

// const emailOptions = {
//   from: 'vlasiuk.oleg.dev@meta.ua',
//   to: 'ikslprint@gmail.com',
//   subject: 'Test email',
//   text: "Test email from localhost:3000"
// }


// transporter.sendMail(emailOptions).then(()=> console.log('Email send success')).catch(error => console.log(error));

// ! MailGun

// const formData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);

// const {MAILGUN_API_KEY} = process.env;

// const mg = mailgun.client({username: 'ikslprint@gmail.com', key: MAILGUN_API_KEY});

// mg.messages.create('sandboxe3ab5d04f5e84fa58b9963b80f0683a6.mailgun.org', {
// 	from: "Excited User <ikslprint@gmail.com>",
// 	to: ["ikslprint@gmail.com"],
// 	subject: "Hello",
// 	text: "Testing some Mailgun awesomeness!",
// 	html: "<h1>Testing some Mailgun awesomeness!</h1>"
// })
// .then(msg => console.log('Success-', msg.status)) // logs response data
// .catch(err => console.log(err)); // logs any error



// !-------------------------------------------

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = 'Server Error'} = err;
  res.status(status).json({ message, })
})

module.exports = app
