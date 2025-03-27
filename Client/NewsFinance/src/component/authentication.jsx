import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

function Authentication() {
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('access_token')){
            return navigate('/login');
        }
    },[])

    return(
        <>
        <Outlet />
        </>
    )
}

export default Authentication;