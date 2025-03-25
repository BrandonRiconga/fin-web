//authorization middleware for verifying if the user is authorized
const {User} = require('../models');

async function authorization(req, res, next) {
    try {
        //get user data from request.user
        const user = req.user;
        //get user data from database
        const userData = await User.findOne({where: {id: user.id}});
        //check if user exists
        if (!userData) {
            //if user does not exist, send error message
            throw {name: 'Unauthorized', message: 'Please login first'};
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authorization;