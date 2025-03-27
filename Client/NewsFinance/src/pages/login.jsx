import { useNavigate } from 'react-router'
import './login.css'
import { useState } from 'react'
import Swal from 'sweetalert2'
import http from '../helpers/axios'

function Login(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
    
        try {
            let loginResp = await http({
                method: 'POST',
                url: '/login',
                data: {
                    email: email,
                    password: password
                }
            })
            const {access_token} = loginResp.data
            localStorage.setItem('access_token', access_token)
            navigate('/')
    
        } catch (error) {
            console.log(error)
            let message = "Something went wrong"
            if(error.response){
                message = error.response.data.message
            }
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error'
            })
        }
    }
    
    const handleRegister = ()=>{
        try {
            navigate('/register')
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
                    <button onClick={handleHome} className='back-button btn btn-outline-danger'>go to Home</button>
                    <h1 className="login-header">Login</h1>
                    <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label >Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter email" onChange={(event)=>{
                            setEmail(event.target.value)
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" onChange={(event)=>{
                            setPassword(event.target.value)
                        }}/>
                    </div>
                    <button type="submit" className="btn btn-success button-login">Login</button>
                    </form>
                    <hr></hr>
                    <button onClick={handleRegister} className='btn btn-primary'>Register</button>
                    <p className='register-text-handler'>Or Register, if you still doesn't have an account</p>
                </div>
            </div>
        </>
    )
}
export default Login;