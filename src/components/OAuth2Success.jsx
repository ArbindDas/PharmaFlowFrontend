import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const OAuth2Success = ()=>{


    const navigate = useNavigate();

    useEffect(() =>{
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            
            localStorage.setItem("jwt" , token);
            navigate("/dashboard")
        }else{
             navigate("/login");
        }
    } , []);

    return <p>Logging you in vai google...</p>
}


export default OAuth2Success;