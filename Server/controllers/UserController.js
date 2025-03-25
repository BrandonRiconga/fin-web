const { signToken } = require("../helpers/jwt");
const bcrypt = require('../helpers/bcrypt');


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

    //method to edit existing user data
    static async updateUser(req, res, next) {
        try {
            //get user data from request.user
            const user = req.user;
            //get updated user data from request.body
            const {username,email,password} = req.body;

            if (!email || !username || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const hashedPassword = bcrypt.hashPassword(password);
            
            await user.update({
                email: email,
                username: username,
                password: hashedPassword
                });
            res.status(200).json(user);
        } catch (error) {
            next(error)
        }
    }

    //method to delete loggedin user
    static async deleteUser(req, res, next) {
        try {
            //get user data from request.user
            const user = req.user;
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController;