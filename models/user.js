const {Schema, model} = require('mongoose');


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegex,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    token: {
        type: String,
        default: "",
    },
    avatarUrl: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        default: "",
    }
}, {versionKey: false, timestamps: true })


// !Щоб статус викидав при помилці
userSchema.post('save', (error, data, next) => {
    const {name, code} = error;
    // !409 MongoServerError коли реэструэмось а такий email вже є
    const status = (name === 'MongoServerError' || code === 11000) ? 409 : 400;
    error.status =status;
    next();
})


const User = model('user', userSchema);


module.exports = User;