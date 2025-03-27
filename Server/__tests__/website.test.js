const request = require('supertest')
const {test, expect, beforeAll, afterAll, beforeEach, describe} = require('@jest/globals')
const app = require('../app')
const {signToken} = require("../helpers/jwt")
const {User, Article} = require('../models')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
const { use } = require('../router')
const e = require('express')
require('dotenv').config()

let access_token

beforeAll(async () => {
    await User.bulkCreate([
        {
            "username" : "Admin",
            "email" : "admin@mail.com",
            "password" : "$2b$10$KuvRdT3sPQ0fBVAJwbOP8efg6ErUR1AqQudMqdriowmon6pZDosc2"
        },
        {
            "username" : "User 4",
            "email" : "user4@mail.com",
            "password" : "$2b$10$EZzwqbkFoHLwJq/tdBXmvOofGxLrkPNBKB0Ladsqe3O6EVDoj4/hS"
        },
        {
            "username" : "User 3",
            "email" : "user3@mail.com",
            "password" : "$2b$10$0Lmc7oWU/R3nK7xLPj4DaepJXF4p1hQYnKYJJVrY4rsk.lZWsUkcK"
        }
    ])

    await Article.bulkCreate([
        {
            "author" : "Weilun Soon",
            "title" : "Latest Oil Market News and Analysis for March 26",
            "description" : "Oil rose after an industry report signaled a major contraction in US crude stockpiles, while the market weighed the prospect of a Russia-Ukraine ceasefire in the Black Sea.",
            "content" : "Oil rose after an industry report signaled a major contraction in US crude stockpiles, while the market weighed the prospect of a Russia-Ukraine ceasefire in the Black Sea.West Texas Intermediate c… ",
            "url" : "https://www.bloomberg.com/news/articles/2025-03-25/latest-oil-market-news-and-analysis-for-march-26",
            "publishedAt" : "2025-03-26 06:28:54.000 +0700",
            "imageUrl" : "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ifkgTnqjWzG4/v0/1200x799.jpg",
            "userId" : 1
        }
    ])
})
afterAll(async ()=> {
    await User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
    await Article.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
})
beforeEach(async () => {
    access_token = signToken({id: 1})
})

//Login
//Login
describe('POST /login', ()=> {
    test("should have access token after successful login", async ()=> {
        const response = await request(app).post('/login').send({
            email: 'admin@mail.com',
            password : 'admin123'
        })
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('access_token')
        expect(typeof response.body.access_token).toBe('string')
    })
    
    test("Email is empty", async ()=> {
        const response = await request(app).post('/login').send({
            email: '',
            password : '$2b$10$wQW3K31vxkmE37F08j3gIeGHoUuNh3RSHO.lgHLJBPTEZH91AnMMu'
        })
        
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Email, and Password must be filled!')
    
    })
    
    test("Password is empty", async ()=> {
        const response = await request(app).post('/login').send({
            email: 'admin@mail.com',
            password : ''
        })
        
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Email, and Password must be filled!')
    })
    
    test("email is invalid", async ()=> {
        const response = await request(app).post('/login').send({
            email: 'admin@email.com',
            password : 'admin123'
        })
        
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Invalid Email/Password')
    })
    
    test("password is invalid", async ()=> {
        const response = await request(app).post('/login').send({
            email: 'admin@mail.com',
            password : 'admin1234'
        })
        
        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Invalid Email/Password')
    })
})

//Register
describe('POST /register', ()=> {
    test("should have access token after successful register", async ()=> {
        const response = await request(app).post('/register').send({
            username: 'Admin',
            email: 'admin@mail.com',
            password : 'admin123'
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('password')
        expect(response.body).toHaveProperty('username')
        expect(typeof response.body.email).toBe('string')
        expect(typeof response.body.id).toBe('number')
        expect(typeof response.body.password).toBe('string')
        expect(typeof response.body.username).toBe('string')
    })
    test("Email is empty", async ()=> {
        const response = await request(app).post('/register').send({
            username: 'Admin',
            email: '',
            password : 'admin123'
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Invalid email, username or password')
    })
    test("Username is empty", async ()=> {
        const response = await request(app).post('/register').send({
            username: '',
            email: 'admin@mail.com',
            password : 'admin123'
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Invalid email, username or password')
    })
    test("Password is empty", async ()=> {
        const response = await request(app).post('/register').send({
            username: 'Admin',
            email: 'admin@mail.com',
            password : ''
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Invalid email, username or password')
    })
})
describe('GET /news', () => {
    test('should return news data', async () => {
        const response = await request(app).get('/news');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
describe('POST /ask', () => {
    test('should handle Gemini request', async () => {
        const response = await request(app).post('/ask').send({
            question: 'What is the current stock price of Tesla?',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    test('should return 400 if question is missing', async () => {
        const response = await request(app).post('/ask').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please ask a question');
    });
});
describe('GET /stocks', () => {
    test('should return stock data', async () => {
        const response = await request(app).get('/stocks');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe('GET /crypto', () => {
    test('should return cryptocurrency data', async () => {
        const response = await request(app).get('/crypto');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
describe('GET /google', () => {
    test('should return Google API key', async () => {
        const response = await request(app).get('/google');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('key');
    });
});

describe('Authenticated Routes', () => {
    let access_token;

    beforeEach(() => {
        access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQzMDM3OTI0fQ.76pFDbF9nU0i1cxLpcMFmjc-qV-X-Ykxv-Wbsc7rW2E'; // Replace with a valid token for testing
    });

    describe('GET /profile', () => {
        test('should return user profile', async () => {
            const response = await request(app)
                .get('/profile')
                .set('Authorization', `Bearer ${access_token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('email');
        });
    });

    describe('PUT /profile', () => {
        test('should update user profile', async () => {
            const response = await request(app)
                .put('/profile')
                .set('Authorization', `Bearer ${access_token}`)
                .send({
                    username: 'Updated User',
                    email: 'updated@mail.com',
                    password: 'newpassword123',
                });
            expect(response.status).toBe(200);
            expect(response.body.username).toBe('Updated User');
        });
    });

    describe('DELETE /profile', () => {
        test('should delete user profile', async () => {
            const response = await request(app)
                .delete('/profile')
                .set('Authorization', `Bearer ${access_token}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
        });
    });

    describe('POST /save', () => {
        test('should save an article', async () => {
            const response = await request(app)
                .post('/save')
                .set('Authorization', `Bearer ${access_token}`)
                .send({
                    title: 'New Article',
                    content: 'This is a new article.',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });

    describe('GET /myArticle', () => {
        test('should return user articles', async () => {
            const response = await request(app)
                .get('/myArticle')
                .set('Authorization', `Bearer ${access_token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('DELETE /myArticle/:id', () => {
        test('should delete an article', async () => {
            const response = await request(app)
                .delete('/myArticle/1')
                .set('Authorization', `Bearer ${access_token}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Article deleted successfully');
        });
    });
});