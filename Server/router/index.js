//router for app.js
const express = require('express');
const UserController = require('../controllers/UserController');
const errorHandler = require('../middleware/errorHandler');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const router = express.Router();

//public routes
router.get('/')
router.post('/login', UserController.login)
router.post('/register', UserController.register)

//authentication middleware
router.use(authentication)

//need authorization to access these routes
router.put('/profile/update', authorization, UserController.updateUser)
router.delete('/profile/delete', authorization, UserController.deleteUser)

//error handling middleware
router.use(errorHandler)

module.exports = router;