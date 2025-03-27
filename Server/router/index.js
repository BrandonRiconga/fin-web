//router for app.js
const express = require('express');
const UserController = require('../controllers/UserController');
const Controllers = require('../controllers/Controller');
const errorHandler = require('../middleware/errorHandler');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const router = express.Router();

//public routes
router.get('/news', Controllers.getNews)
router.post('/login', UserController.login)
router.post('/google-login', UserController.loginGoogle)
router.post('/register', UserController.register)
router.post('/ask', Controllers.handleGemini)
router.get('/stocks', Controllers.getStock)
router.get('/crypto', Controllers.getCryptoCurrency)

//get google API key
router.get('/google', (req,res)=>{
    res.json({key: process.env.GOOGLE_API_KEY})
})
//authentication middleware
router.use(authentication)

//need authorization to access these routes
//profile routes
router.get('/profile', UserController.getUser)
router.put('/profile', UserController.updateUser)
router.delete('/profile', UserController.deleteUser)

//article routes
router.post('/save', Controllers.saveArticle)
router.get('/myArticle', Controllers.getArticle)
router.delete('/myArticle/:id', authorization, Controllers.deleteArticle)

//error handling middleware
router.use(errorHandler)

module.exports = router;