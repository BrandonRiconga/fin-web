import { useNavigate } from 'react-router';
import './article-card.css';
import Swal from 'sweetalert2';
import http from '../helpers/axios';
function ArticleCard(news) {
    const navigate = useNavigate();
    const formattedDate = new Date(news.data.publishedAt).toLocaleDateString('en-GB');
    const formattedContent = news.data.content.split('[+')[0];

    const handleBookmark = async() => {
        try {
            const token = localStorage.getItem('access_token');
            if(!token){
                Swal.fire({
                    title: 'Error',
                    text: 'Please Login First',
                    icon: 'error'
                });
            }

            await http({
                method: 'POST',
                url: '/save',
                data: {
                    author: news.data.author || 'news-author',
                    title: news.data.title || 'news-title',
                    description: news.data.description || 'news-description',
                    content: news.data.content || 'news-content',
                    url: news.data.url || 'news-data-link',
                    publishedAt: news.data.publishedAt || new Date(),
                    imageUrl: news.data.urlToImage || 'https://via.placeholder.com/150',
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Swal.fire({
                title: 'Success',
                text: 'Bookmark Success',
                icon: 'success'
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'Bookmark Failed',
                icon: 'error'
            });
        }
    }

  return (
    <div className='article-card-container'>
        <div className="article-card">
            <div className='article-main'>
                <h3 className="article-title">{news.data.title}</h3>
                <p className='article-content'>{formattedContent}</p>

                <p className='article-url'  >URL: <a href={news.data.url} >  {news.data.url}</a></p>
                <p className='article-published'>Published At: {formattedDate}</p>
            </div>
            <div className='article-side'>
                <div className='article-image-container'>
                    <img className='article-image' src={news.data.urlToImage} alt='article-image'/>
                </div>
                <button className='btn btn-outline-success add-bookmark' onClick={handleBookmark}>Bookmark +</button>
            </div>
        </div>
        
    </div>
    
  );
}

export default ArticleCard;