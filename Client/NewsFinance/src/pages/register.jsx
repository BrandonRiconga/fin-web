import { useNavigate } from 'react-router';
import './register.css';
import { useState } from 'react';
import http from '../helpers/axios';
import Swal from 'sweetalert2';

function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            await http({
                method: 'POST',
                url: '/register',
                data: {
                    email: email,
                    password: password,
                    username: username
                }
            })
            Swal.fire({
                title: 'Success',
                text: 'Register Success',
                icon: 'success'
            })
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogin = ()=>{
        try {
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
    return(
        <>
            <div className="login-container">
                <div className="login-form">
                    <button className='back-button btn btn-outline-danger' onClick={handleHome}>go to Home</button>
                    <h1 className="login-header">Register</h1>
                    <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label >Username</label>
                        <input type="text" className="form-control" placeholder="Enter Username" onChange={(event)=>{
                            setUsername(event.target.value)
                        }}/>    
                    </div>
                    <div className="form-group">
                        <label >Email</label>
                        <input type="email" className="form-control" placeholder="Enter email" onChange={(event)=>{
                            setEmail(event.target.value)
                        }}/>    
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password" onChange={(event)=>{
                            setPassword(event.target.value)
                        }}/>
                    </div>
                    <button type="submit" className="btn btn-success button-login">Register</button>
                    </form>
                    <hr></hr>
                    <button className='btn btn-primary' onClick={handleLogin}>Login</button>
                    <p className='register-text-handler'>Or Login, if you already have an account</p>
                </div>
            </div>
        </>
    )
}

export default Register;