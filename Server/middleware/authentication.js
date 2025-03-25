//authentication middleware for verifying the token
const {verifyToken} = require('../helpers/jwt');
const {User} = require('../models');

async function authentication(req, res, next) {
    try {
        //get authorization from request header
        const {authorization} = req.headers;
        //check if authorization exists
        if (!authorization) {
            //if authorization does not exist, send error message
            throw {name: 'Unauthorized', message: 'Please login first'};
        }
        //split authorization to get token
        const authorizationText = authorization.split(' ');
        if(authorizationText[0] !== 'Bearer' || !authorizationText[1]) {
            throw {name: 'Unauthorized', message: 'Please login first'};
        }
        const token = authorizationText[1];
        //get user data from database
        const user = await User.findOne({where: {email: verifyToken(token).email}});
        //check if user exists
        if (!user) {
            //if user does not exist, send error message
            throw {name: 'Unauthorized', message: 'Please login first'};
        }
        //set user data to request.user
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authentication;