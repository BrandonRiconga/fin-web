import axios from 'axios';

function http(){
    return axios.create({
        baseURL: 'http://localhost:3000/'
    });
}

export default http;