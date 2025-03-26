import './home.css'
import { useEffect, useState } from 'react';
import http from '../helpers/axios';

function Home(){
    const [stockData, setStockData] = useState([]);
    return(
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default Home;