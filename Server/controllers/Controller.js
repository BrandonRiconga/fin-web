const { Article } = require('../models');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('../helpers/axios');

class Controllers {
    static async saveArticle(req, res, next) {
        try {
            const { userId, author, title, description, url, publishedAt, content, imageUrl } = req.body;
            if (!userId && !author && !title && !description && !url && !publishedAt && !content && !imageUrl) {
                throw {name: 'Not Found', message: 'Article not found'};
            }
            const checkArticle = await Article.findOne({ where: { url: url } });
            if (checkArticle) {
                throw {name: 'Bad Request', message: 'Article already saved'};
            }
            const newContent = content.split('[+')[0];

            await Article.create({
                userId : req.user.id,
                author : author,
                title : title,
                description : description,
                url : url,
                publishedAt : publishedAt,
                imageUrl : imageUrl,
                content : newContent
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

    static isFinanceRelated = (text)=>{
        return financeKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }

    //handling GeminiAI API from user input
    static async handleGemini (req, res, next) {
        try {
            const {question} = req.body;
            if(!question){
                throw {name: 'Bad Request', message: 'Please ask a question'};
            }
            const financeKeywords = ['stocks', 'investments', 'finance', 'economy', 'market', 'currency', 'tax', 'financial', 'trading', 'bonds', 'shares', 'dividends', 'capital', 'market', 'equity', 'portfolio', 'asset', 'liability', 'income', 'expense', 'profit', 'loss', 'revenue', 'debt', 'credit', 'loan', 'interest', 'rate', 'inflation', 'deflation', 'recession', 'depression', 'boom', 'bust', 'bull', 'bear', 'market', 'stock', 'exchange', 'bond', 'mutual', 'fund', 'index', 'option', 'future', 'commodity', 'derivative', 'hedge', 'fund', 'private', 'equity', 'venture', 'capital', 'angel', 'investor', 'crowdfunding', 'initial', 'public', 'offering', 'IPO', 'merger', 'acquisition', 'takeover', 'divestiture', 'spinoff', 'joint', 'venture', 'partnership', 'corporation', 'company', 'firm', 'business', 'enterprise', 'organization', 'institution', 'government', 'regulation', 'policy', 'law', 'rule', 'taxation', 'audit', 'accounting', 'financial', 'statement', 'balance', 'sheet', 'income', 'statement', 'cash', 'flow', 'statement', 'valuation', 'discounted', 'cash', 'flow', 'DCF', 'net', 'present', 'value', 'NPV', 'internal', 'rate', 'return', 'IRR', 'return', 'investment', 'ROI', 'risk', 'return', 'risk', 'free', 'rate', 'beta', 'alpha', 'standard', 'deviation', 'variance', 'correlation', 'covariance', 'diversification', 'hedging', 'arbitrage', 'speculation', 'technical', 'analysis', 'fundamental', 'analysis', 'efficient', 'market', 'hypothesis', 'random', 'walk', 'theory', 'behavioral', 'finance', 'value', 'investing', 'growth', 'investing', 'momentum', 'investing', 'contrarian', 'investing', 'income', 'investing', 'index', 'investing', 'passive', 'investing', 'active', 'investing', 'day', 'trading', 'swing', 'trading', 'price']
            const isFinanceRelated = financeKeywords.some(keyword => question.toLowerCase().includes(keyword));
            //check if the question is finance related
            
            if(!isFinanceRelated){
                throw {name: 'Bad Request', message: 'Please ask a finance related question'};
            }
            const prompt = `You are an assistant focused only on finance topics. Please provide answers related to finance, such as stocks, investments, economy, and market trends. Question: ${question}`
        
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
            const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});

            const result = await model.generateContent(prompt);
            const message = typeof result.response.text === 'function' ? await result.response.text() : result.response.text;

            res.status(200).json({ message });
        } catch (error) {
            next(error);
        }
    }

    //get the news data from NewsAPI
    static async getNews (req, res, next) {
        try {
            const newsResponse = await http({
                method: 'GET',
                url: 'https://newsapi.org/v2/top-headlines',
                params:{
                    q: 'stock',
                    pageSize: 5,
                    sortBy: 'popularity',
                    apiKey: process.env.NEWS_API_KEY
                }
            })
            const newsData = newsResponse.data.articles;
            if(newsData.length === 0){
                throw {name: 'Not Found', message: 'News not found'};
            }
            res.status(200).json(newsData);
        } catch (error) {
            next(error);
        }
    }

    //get the TwelveData stocks data
    static async getStock (req, res, next) {
        try{
            const StockCollection=[]
            const STOCK_SYMBOL = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA'];
            for(let i = 0; i < STOCK_SYMBOL.length; i++){
                const StockResponse = await http({
                    method: 'GET',
                    url: 'https://api.twelvedata.com/time_series',
                    params: {
                        symbol: STOCK_SYMBOL[i],
                        interval: '15min',
                        outputsize: 1,
                        apikey: process.env.TWELVE_DATA_API_KEY
                    }
                })
                const stockData = StockResponse.data;
                if(stockData.code === 400){
                    throw {name: 'Bad Request', message: 'Invalid request'};
                }
                else{
                    StockCollection.push({
                        symbol: stockData.meta.symbol,
                        price: +stockData.values[0].close
                    });
                }
            }
            res.status(200).json(StockCollection);
        }
        catch(error){
            next(error);
        }
    }

    //get the CryptoCompare cryptocurrency data
    static async getCryptoCurrency (req, res, next) {
        try {
            const cryptoCollection = []
            const CRYPTO_FSYM = ['BTC', 'ETH', 'LTC', 'XRP', 'DOGE'];
            for(let i = 0; i < CRYPTO_FSYM.length; i++){
                const cryptoResponse = await http({
                    method: 'GET',
                    url: 'https://min-api.cryptocompare.com/data/price',
                    params: {
                        fsym: CRYPTO_FSYM[i],
                        tsyms: 'USD',
                        apikey: process.env.CRYPTOCOMPARE_API_KEY
                    }
                })
                if(cryptoResponse.data.Response !== 'Error'){
                    const cryptoData = {
                        symbol: CRYPTO_FSYM[i],
                        price: cryptoResponse.data.USD
                    };
                    cryptoCollection.push(cryptoData);
                }
            }
            res.status(200).json(cryptoCollection);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = Controllers;