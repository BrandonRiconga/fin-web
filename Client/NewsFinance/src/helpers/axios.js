import axios from 'axios';

const http = axios.create({
    baseURL: 'https://www.brandonriconga.my.id/',
    timeout: 10000
});

export default http;