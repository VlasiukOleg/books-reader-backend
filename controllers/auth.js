const Joi = require('joi');

const User = require('../models/user')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises')
const {nanoid} = require('nanoid');


const {HttpError, sendEmail} = require('../helpers')

// const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const dotenv = require('dotenv');
dotenv.config();

const {SECRET_KEY, BASE_URL} = process.env;



const registerSchema  = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

const emailSchema = Joi.object({
    email: Joi.string().required(),
})

const loginSchema  = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})



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

        const verificationCode = nanoid();

        const newUser = await User.create({...req.body, password: hashPassword, avatarUrl, verificationCode});
        const verifyEmail = {
            to: email,
            html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Please verify Email</a>`
        }

        await sendEmail(verifyEmail);
        
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
        if (!user.verify) {
            throw HttpError(401, 'Email not verified');
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

const verifyEmail = async(req,res,next) => {
    try {
        const {verificationCode} = req.params;
        const user =await User.findOne({verificationCode});
        if (!user) {
            throw HttpError(401, 'Email not found');
        }
        
        await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});
        res.json({
        message: "Email verify success",
    })
    } catch (error) {
        next(error);
    }
   
}

const resendVerifyEmail = async (req,res,next) => {
    try {
        const {error} = emailSchema.validate(req.body);
        if (error) {
            throw HttpError(400);
        }
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            throw HttpError(401, "Email not found")
        }
        if (user.verify) {
            throw HttpError(401, "Email has already verified")
        }
        const verifyEmail = {
            to: email,
            html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Please verify Email</a>`
        }

        await sendEmail(verifyEmail);

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
    verifyEmail,
    resendVerifyEmail
}