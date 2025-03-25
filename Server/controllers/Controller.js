const { Article } = require('../models');

class Controllers {
    static async saveArticle(req, res, next) {
        try {
            const { userId, title, description, url, published_at, content, image_url } = req.body;
            if (!userId || !title || !description || !url || !published_at || !content || !image_url) {
                throw {name: 'Not Found', message: 'Article not found'};
            }

            await Article.create({
                userId : userId,
                title : title,
                description : description,
                url : url,
                publishedAt : published_at,
                imageUrl : image_url,
                content : content
            });
            res.status(200).json({message: 'Article saved successfully'});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controllers;