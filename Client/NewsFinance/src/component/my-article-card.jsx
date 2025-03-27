import { useNavigate } from 'react-router';
import './my-article-card.css';
import Swal from 'sweetalert2';
import http from '../helpers/axios';
import { useEffect } from 'react';
function MyArticleCard({data, handleMyArticle}) {
    const formattedDate = new Date(data.publishedAt).toLocaleDateString('en-GB');
    const handleDelete = async() => {
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
                method: 'DELETE',
                url: `/myArticle/${data.id}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            Swal.fire({
                title: 'Success',
                text: 'Delete Success',
                icon: 'success'
            });
            handleMyArticle();
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'Delete Failed',
                icon: 'error'
            });
        }
    }

    return (
    <div className='article-card-container'>
        <div className="article-card">
            <div className='article-main'>
                <h3 className="article-title">{data.title}</h3>
                <p className='article-content'>{data.content}</p>

                <p className='article-url'  >URL: <a href={data.url} >  {data.url}</a></p>
                <p className='article-published'>Published At: {formattedDate}</p>
            </div>
            <div className='article-side'>
                <div className='article-image-container'>
                    <img className='article-image' src={data.imageUrl} alt='article-image'/>
                </div>
                <button className='btn btn-danger delete-bookmark' onClick={handleDelete}>Delete Bookmark</button>
            </div>
        </div>
        
    </div>
    
  );
}

export default MyArticleCard;