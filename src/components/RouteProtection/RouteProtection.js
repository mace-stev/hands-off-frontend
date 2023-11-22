import PostForm from "../PostForm/PostForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
function RouteProtection(){
    const navigate = useNavigate()
    const token = sessionStorage.getItem('jwt');
    useEffect(()=>{
if(!token){
    navigate('/')
    return alert("Please sign in first")
    
}


},[])


return(<><PostForm/>
    </>)

}
export default RouteProtection