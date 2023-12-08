import PostForm from "../PostForm/PostForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
function RouteProtection(){
    const navigate = useNavigate()
    const token = sessionStorage.getItem('jwt');
    useEffect(()=>{
if(!token){
    navigate('/')
    return alert("Please sign in first")
    
}


},[])


return(<>
<Navbar/>
<PostForm/>
<Footer/>
    </>)

}
export default RouteProtection