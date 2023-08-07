const Joi = require('joi');

const User = require('../models/user')

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')


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

        const newUser = await User.create({...req.body, password: hashPassword });
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


module.exports = {
    register,
    login,
    getCurrent,
    logout,
}