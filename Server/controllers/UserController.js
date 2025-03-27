require('dotenv').config();
const { signToken } = require("../helpers/jwt");
const {hashPassword, verifyPassword} = require('../helpers/bcrypt');
const {User} = require('../models');
const {OAuth2Client} = require('google-auth-library');
const { defaults } = require('../helpers/axios');

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
            const user = await User.findOne({where: {email: email}});
            if (!user) {
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

    static async loginGoogle(req, res, next) {
        try {
            const {googleToken} = req.body;

            const client = new OAuth2Client();
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_API_KEY,
            });
            const payload = ticket.getPayload();
            const [user] = await User.findOrCreate({
                where: {
                    email: payload.email
                },
                defaults: {
                    username: payload.name,
                    email: payload.email,
                    password: Math.random().toString(36).slice(-8)
                }
            });
            const access_token = signToken({id: user.id});
            res.json({access_token})

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
            const newUser = await User.create({
                username:username,
                email:email,
                password:password
            });
            res.status(201).json(newUser);
        } catch (error) {
            next(error)
        }
    }

    //method to edit existing user data
    static async updateUser(req, res, next) {
        try {
            const {username,email,password} = req.body;
            const user = await User.findOne({where: {id: req.user.id}});
            if (!user) {
                throw {name: 'Forbidden', message: 'Forbidden access'};
            }
            //get updated user data from request.body
            
            if (!email || !username || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const hashedPassword = hashPassword(password);
            
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
            if(!user) {
                throw {name: 'Forbidden', message: 'Forbidden access'};
            }
            //delete user data
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error)
        }
    }

    //method to get loggedin user data
    static async getUser(req, res, next) {
        try {
            //get user data from request.user
            const user = req.user;
            if(!user) {
                throw {name: 'Forbidden', message: 'Forbidden access'};
            }
            res.status(200).json(user);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController;