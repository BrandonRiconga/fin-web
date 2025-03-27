import './navbar.css'
import { useNavigate } from 'react-router-dom'

// Desc: Navbar component for the dashboard
function Navbar(){
    const navigate = useNavigate()
    const handleLogin = ()=>{
        try {
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
    }
    const handleLogout = ()=>{
        try {
            localStorage.removeItem('access_token');
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
    }
    const handleHome = ()=>{
        try {
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }
    const handleMyArticle = ()=>{
        try {
            navigate('/mypage')
        } catch (error) {
            console.log(error);
        }
    }
    const handleProfile = ()=>{
        try {
            navigate('/profile')
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <h4 className="navbar-brand">Finance News</h4>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="" onClick={handleHome}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="" onClick={handleMyArticle}>My Article</a>
                        </li>
                    </ul>
                    <div className="login-button-div">
                        {localStorage.getItem('access_token') ? <div className='profile-logout-div'>
                            <button className="btn btn-primary" onClick={handleProfile}>Profile</button> 
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                            </div>: 
                            <button className="btn btn-outline-success" onClick={handleLogin}>Login</button>}
                            
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar