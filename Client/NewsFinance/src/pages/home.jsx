import './home.css'
import { useEffect, useState } from 'react';
import http from '../helpers/axios';
import Navbar from '../component/navbar';
import ArticleCard from '../component/article-card';
import FinanceChatbot from '../component/chatbot';

function Home(){
    const [stockData, setStockData] = useState([]);
    const [cryptoData, setCryptoData] = useState([]);
    const [newsData, setNewsData] = useState([]);

    const formatStockData = (stocks) => {
        return stocks.map(stock => `${stock.symbol} : ${stock.price}`).join(' | ');
    }
    const formatCryptoData = (crypto) => {
        return crypto.map(crypto => `${crypto.symbol} : ${crypto.price}`).join(' | ');
    }

    const fetchStockData = async () => {
        try {
            const response = await http({
                method: 'GET',
                url: '/stocks'
            });
            const responseData = response.data;
            setStockData(responseData);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCryptoData = async () => {
        try {
            const response = await http({
                method: 'GET',
                url: '/crypto'
            });
            const responseData = response.data;
            setCryptoData(responseData);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchArticleData = async () => {
        try {
            const response = await http({
                method: 'GET',
                url: '/news'
            });
            const responseData = response.data;
            setNewsData(responseData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchArticleData();
        fetchStockData();
        fetchCryptoData();
        setInterval(fetchStockData, 600000)
        setInterval(fetchCryptoData, 600000)
        return ()=>{
            clearInterval(fetchStockData);
            clearInterval(fetchCryptoData);
        }
    }, []);

    return(
        <>
            <Navbar />
            <div className="ticker-wrapper">
                <div className="ticker">
                    {stockData.length > 0 ? formatStockData(stockData) : 'Loading stock data...'}
                </div>
                </div>
                <div className="ticker-wrapper">
                <div className="ticker">
                    {cryptoData.length > 0 ? formatCryptoData(cryptoData) : 'Loading crypto data...'}
                </div>
            </div>
            <div>
                {newsData.map((news,index)=>(
                    <ArticleCard key={index} data={news}/>
                ))}
            </div>
            <FinanceChatbot />
        </>
        
        
    )
}

export default Home