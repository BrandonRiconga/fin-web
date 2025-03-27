//authorization middleware for verifying if the user is authorized
const {Article} = require('../models');

async function authorization(req, res, next) {
    try {
        const id = +req.params.id;
        const articles = await Article.findByPk(id);
        if(!articles){
            throw {name: 'Not Found', message: 'Article not found'};
        }
        if(articles.userId !== req.user.id){
            throw {name: 'Forbidden', message: 'You are not authorized'};
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authorization;