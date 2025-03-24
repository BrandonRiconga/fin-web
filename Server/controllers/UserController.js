const { signToken } = require("../helpers/jwt");


//class UserController
class UserController {
    //method to add user
    static async login(req, res, next) {
        try {
            //get user data
            const {email,password} = req.body;
            //check if user exists
            if (!email || !password) {
                //if user does not exist, send error message}
                throw {name: 'Unauthorized', message: 'Invalid email or password'};
            }
            const pwValid = await verifyPassword(password, user.password);
            if (!pwValid) {
                throw {name: 'Unauthorized', message: 'Invalid email or password'};
            }
            const access_token = signToken({id: user.id});
            res.status(200).json({access_token});
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        try {
            //get user data
            const {username,email,password} = req.body;
            //check if user exists
            if (!username || !email || !password) {
                //if user does not exist, send error message}
                throw {name: 'Bad Request', message: 'Invalid email, username or password'};
            }
            const newUser = await User.create({username,email,password});
            res.status(201).json(newUser);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController;