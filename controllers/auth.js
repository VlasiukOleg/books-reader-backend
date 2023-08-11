const Joi = require('joi');

const User = require('../models/user')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises')


const {HttpError} = require('../helpers')

// const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const dotenv = require('dotenv');
dotenv.config();

const {SECRET_KEY} = process.env;



const registerSchema  = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

const loginSchema  = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

// const avatarSchema = Joi.object({
//     avatar: Joi.string().required(),
// })


const register = async (req, res,next) => {
    try {
        const {error} = registerSchema.validate(req.body)
        if (error) {
        throw HttpError(400, error.message);
        }
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (user) {
            throw HttpError(409, 'Email is already use');
            }
        
        const hashPassword = await bcrypt.hash(password,10);
        // !Повертється посилання на тимчасову аватарку
        const avatarUrl = gravatar.url(email);

        const newUser = await User.create({...req.body, password: hashPassword, avatarUrl});
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
        })
    } catch (error) {
        next(error);
    }
    
}

const login = async (req,res,next) => {
    try {
        const {error} = loginSchema.validate(req.body)
        if (error) {
        throw HttpError(400, error.message);
        }
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            throw HttpError(401, 'Email or password invalid');
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, 'Email or password invalid');
        }
        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'})
        await User.findByIdAndUpdate(user._id, {token})

        res.json({
            token,
        });
        
    } catch (error) {
        next(error);
    }
}

const getCurrent = async(req,res) => {

        const {name, email} = req.user;
        console.log(req.user);
        res.json({
            name,
            email,
        })
}

const logout = async(req,res) => {
    const {_id} = req.user;

    await User.findByIdAndUpdate(_id, {token: ""}) 
    res.json({
        message: "Logout success"
    })
}

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');
console.log(avatarsDir)

const updateAvatar = async(req,res,next) => {
    try {
        const {_id} = req.user;
        const {path: tempUpload, originalname } = req.file;
        const fileName = `${_id}_${originalname}`
        const resultUpload = path.join(avatarsDir, fileName);
        await fs.rename(tempUpload, resultUpload);
        const avatarUrl = path.join('avatars', fileName);
        await User.findByIdAndUpdate(_id, {avatarUrl});
        res.json({
            avatarUrl,
        })
    } catch (error) {
        next(error);
    }
}


module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateAvatar,
}