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
    const [isLoadingStock, setIsLoadingStock] = useState(true);
    const [isLoadingCrypto, setIsLoadingCrypto] = useState(true);

    const formatStockData = (stocks) => {
        return stocks.map(stock => `${stock.symbol} : ${stock.price}`).join(' | ');
    }
    const formatCryptoData = (crypto) => {
        return crypto.map(crypto => `${crypto.symbol} : ${crypto.price}`).join(' | ');
    }

    const fetchStockData = async () => {
        try {
            setIsLoadingStock(true);
            const response = await http({
                method: 'GET',
                url: '/stocks'
            });
            const responseData = response.data;
            setStockData(responseData);
            setIsLoadingStock(false);
        } catch (error) {
            console.log(error);
            setIsLoadingStock(false);
        }
    }

    const fetchCryptoData = async () => {
        try {
            setIsLoadingCrypto(true);
            const response = await http({
                method: 'GET',
                url: '/crypto'
            });
            const responseData = response.data;
            setCryptoData(responseData);
            setIsLoadingCrypto(false);
        } catch (error) {
            console.log(error);
            setIsLoadingCrypto(false);
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
        const stockInterval = setInterval(fetchStockData, 600000)
        const cryptoInterval = setInterval(fetchCryptoData, 600000)
        return ()=>{
            clearInterval(stockInterval);
            clearInterval(cryptoInterval);
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