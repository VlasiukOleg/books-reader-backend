const jwt = require('jsonwebtoken')

const {HttpError} = require('../helpers')

const User = require('../models/user')

const dotenv = require('dotenv');
dotenv.config();

const {SECRET_KEY} = process.env;



const authenticate = async (req,res,next) => {
    const {authorization = ""} = req.headers;
   
    const [bearer, token] = authorization.split(" ");
    console.log(bearer);
    console.log(token);
    if (bearer !== "Bearer") {
        console.log('Yes')
        next(HttpError(401));
    }
    try {
        const {id} = jwt.verify(token, SECRET_KEY)
        const user = await User.findById(id);
        console.log(id);
        console.log(user);
        if (!user || !user.token || user.token !== token) {
            next(HttpError(401));
        }
        // !Записуємо інформацію хто робить запить, щоб в кожному контролері ця інформація була
        req.user = user;

        next();
    } catch (error) {
        next(HttpError(401));
    }

}





module.exports = authenticate;