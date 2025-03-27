const axios = require('axios');

const http = axios.create({
    baseURL: 'https://www.brandonriconga.my.id/'
});

module.exports = http;