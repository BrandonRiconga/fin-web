import Navbar from '../component/navbar';
import './profile.css';
import http from '../helpers/axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

function Profile(){
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate()
    const [profile, setProfile] = useState({});
    const [formVisible, setFormVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const toggleForm = () => {
        setFormVisible((state) => !state);
    }
    async function handleProfile(){
        try {
            const response = await http({
                method: 'GET',
                url: '/profile',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const profileData = response.data;
            setProfile(profileData);

            setEmail(profileData.email);
            setUsername(profileData.username);

        } catch (error) {
            console.log(error);
        }
    }

    async function handleEditProfile(event){
        event.preventDefault();
        try {
            const response = await http({
                method: 'PUT',
                url: '/profile',
                data: {
                    email: email,
                    username: username,
                    password: password
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const profileData = response.data;
            setProfile(profileData);
            setFormVisible(false);
            Swal.fire({
                title: 'Success',
                text: 'Profile Updated',
                icon: 'success'
            });
        } catch (error) {
            console.log(error);
        }
    }

    function handleDeleteProfile(){
        try {
            //delete confirmation using SweetAlert2
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Yes, I'm sure!"
            }).then((result) => {
                if (result.isConfirmed) {
                    const response = http({
                        method: 'DELETE',
                        url: '/profile',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    Swal.fire({
                        title: 'Success',
                        text: 'Profile Deleted',
                        icon: 'success'
                    });
                    localStorage.removeItem('access_token');
                    navigate('/login');
                }
            })
        } 
        catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        handleProfile();
    }, [token])
    return(
        <div>
            <Navbar/>
            <h1 className='profile-title'>My Profile</h1>
            <div className='profile-div'>
                <div className='profile-content'>
                    <h2>{profile.username}</h2>
                    <h5>Email: {profile.email}</h5>
                    {formVisible && 
                        <div className='profile-edit-form'>
                            <hr/>
                            <form onSubmit={handleEditProfile}>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input type="email" className="form-control" placeholder='Someone@email.com' value={email} onChange={(event)=>{
                                        setEmail(event.target.value);
                                    }}/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" placeholder='John Doe' value={username} onChange={(event)=>{
                                        setUsername(event.target.value);
                                    }}/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" placeholder='password' value={password} onChange={(event)=>{
                                        setPassword(event.target.value);
                                    }}/>
                                </div>
                                <button className='btn btn-primary'>Save</button>
                            </form>
                        </div>
                    }
                </div>
                <div>
                    <div className='profile-control'>
                        <button className='btn btn-primary' onClick={toggleForm}>Edit Profile</button>
                        <button className='btn btn-danger' onClick={handleDeleteProfile}>Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;