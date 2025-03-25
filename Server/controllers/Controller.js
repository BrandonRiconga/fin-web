const { Article } = require('../models');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

    //method to get all saved articles from loggedin user
    static async getArticle (req, res, next) {
        try {
            const articles = await Article.findAll({
                where: { userId: req.user.id },
                include: 'User',
                attributes: { exclude: ['password'] }
            });
            res.status(200).json(articles);
        } catch (error) {
            next(error);
        }
    }

    //method to get detail of saved article from loggedin user
    static async getDetailArticle (req, res, next) {
        try {
            const article = await Article.findOne({
                where: { id: req.params.id },
                include: 'User',
                attributes: { exclude: ['password'] }
            });
            res.status(200).json(article);
        } catch (error) {
            next(error);
        }
    }

    //method to delete saved article from loggedin user
    static async deleteArticle (req, res, next) {
        try {
            const article = await Article.findOne({ where: { id: req.params.id } });
            if (!article) {
                throw {name: 'Not Found', message: 'Article not found'};
            }
            await article.destroy();
            res.status(200).json({ message: 'Article deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    //handling GeminiAI API from user input
    static async handleGemini (req, res, next) {
        try {
            const {question} = req.body;
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
            const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});

            const prompt = question
            const result = await model.generateContent(prompt);
            const message = result.response.text;
            res.status(200).json({ message });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controllers;