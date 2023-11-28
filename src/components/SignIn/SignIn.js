import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { useNavigate, useLocation } from "react-router-dom";

import axios from 'axios'
import "./SignIn.scss"



function SignIn() {
    const state = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)+ Math.random().toString(36).slice(2)+ Math.random().toString(36).slice(2);
    const appUrl=process.env.REACT_APP_APP_URL
    const [open, setOpen] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
   
   

    function popupHandler(e) {
        e.preventDefault()
        axios.post(`/api/profile`,{
            username: e.target['username'].value,
            password: e.target['password'].value
        }).then((response)=>{
            console.log(response)
            alert('Profile Created')
        }).catch((err)=>{
           
            alert(err+":"+err.response.data)
        })
    }
    function signinHandler(e) {
        e.preventDefault()
        
        axios.post(`/api/auth`,{
            username: e.target['username'].value,
            password: e.target['password'].value,
            stateToHash: state
        }).then((response)=>{
            alert('Successfully signed-in')
            sessionStorage.setItem('jwt', response.headers.authorization.split(' ')[1])
            return navigate('/post', {state: response.data})
        })
        .catch((err)=>{
            console.log(err+" error logging in")
            alert('Username or password is incorrect')
        })
       
    }
    return (
        <>
            <form className="sign-in-form" onSubmit={(e) => { signinHandler(e) }}>
                <input className="sign-in-form__username" name="username" required placeholder="username"></input>
                <input type="password" className="sign-in-form__password" name="password" required placeholder="password"></input>
                <button type="submit" placeholder="Login" className="sign-in-form__login">Login</button>
            </form>
            <button placeholder="Sign-up?" onClick={(e) => {
            
                setOpen(true)
            }} className={"signup-button"}>Sign-Up?</button>
            <Popup open={open} position="center center" closeOnDocumentClick={false} className="signup_popup">
                <form className="signup__popup" onSubmit={(e) => { popupHandler(e) }}>
                    <button onClick={() => setOpen(false)}>Close</button>
                    <input type="text" name="username" placeholder='username' className="signup-input" required></input>
                    <input type="password" name="password" placeholder='password' className="signup-input" required></input>
                    <input type="submit" placeholder="Create Profile" className="signup-input"></input>
                </form>
            </Popup>

        </>
    )
}
export default SignIn;
