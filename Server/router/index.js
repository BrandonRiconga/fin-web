//router for app.js
const express = require('express');
const UserController = require('../controllers/UserController');
const Controllers = require('../controllers/Controller');
const errorHandler = require('../middleware/errorHandler');
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const router = express.Router();

//public routes
router.get('/', Controllers.getNews)
router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.post('/ask', Controllers.handleGemini)
router.get('/stock', Controllers.getStock)
router.get('/crypto', Controllers.getCryptoCurrency)
//authentication middleware
router.use(authentication)

//need authorization to access these routes
//profile routes
router.put('/profile', UserController.updateUser)
router.delete('/profile', UserController.deleteUser)

//article routes

router.post('/save/:id', Controllers.saveArticle)
router.get('/myArticle', Controllers.getArticle)
router.get('/myArticle/:id', Controllers.getDetailArticle)
router.delete('/myArticle/:id', authorization, Controllers.deleteArticle)

//error handling middleware
router.use(errorHandler)

module.exports = router;