import './mypage.css';
import Navbar from '../component/navbar';
import { useEffect, useState } from 'react';
import MyArticleCard from '../component/my-article-card';
import http from '../helpers/axios';

function myPage(){
    const token = localStorage.getItem('access_token');
    const [myArticle, setMyArticle] = useState([])
    async function handleMyArticle(){
        try {
            const response = await http({
                method: 'GET',
                url: '/myarticle',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const myArticleData = response.data;
            setMyArticle(myArticleData);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        handleMyArticle();
    }, [])
    return(
        <>
            <Navbar/>
            <div>
                <h1 className='myarticle-title'>My Article Page</h1>
            </div>
            {myArticle.map((article, index) => {
                return <MyArticleCard key={index} data={article} handleMyArticle={handleMyArticle}/>
            })}
        </>
    );
}

export default myPage;