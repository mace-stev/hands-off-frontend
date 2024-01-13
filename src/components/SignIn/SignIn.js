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
    const [forgotOpen, setForgotOpen] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
   
   

    function popupHandler(e) {
      e.preventDefault()
        axios.post(`/api/profile`,{
            username: e.target['username'].value,
            password: e.target['password'].value,
            email: e.target['email'].value
        }).then((response)=>{
            console.log(response)
            alert('Profile Created')
            setOpen(false)
        }).catch((err)=>{
           
            alert(err.response.data)
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
        function forgotPassword(e){
            e.preventDefault();
            axios.post('/api/profile/forgot-password', {email: e.target['email'].value}).then((response)=>{
                alert("If the email belongs to an existing account, check your inbox")
             navigate('/')
            }).catch((error)=>{
                alert('internal server error, please try again')
                navigate('/')
            })
        }
    return (
        <>
            <form className="sign-in-form" onSubmit={(e) => { signinHandler(e) }}>
                <input className="sign-in-form__username" name="username" required placeholder="username"></input>
                <input type="password" className="sign-in-form__password" name="password" required placeholder="password"></input>
                <button type="submit" placeholder="Login" className="sign-in-form__login">Login</button>
            </form>
            <button placeholder="Sign-up?" onClick={(e) => {setOpen(true)}} className="signup-or-forgot__button">Sign-Up?</button>
            <Popup open={open} position="center center" closeOnDocumentClick={false} className="signup-or-forgot_popup">
                <form className="signup-or-forgot__popup" onSubmit={(e) => { popupHandler(e) }}>
                    <button className="signup-or-forgot__popup--close" onClick={() => setOpen(false)}>Close</button>
                    <input type="text" name="username" placeholder='username' className="signup-or-forgot__input" required></input>
                    <input type="password" name="password" placeholder='password' className="signup-or-forgot__input" required></input>
                    <input type="text" name="email" placeholder='email' className="signup-or-forgot__input" required></input>
                    <input type="submit" placeholder="Create Profile" className="signup-or-forgot__submit"></input>
                </form>
            </Popup>
            <button placeholder="forgot password?" onClick={(e) => {setForgotOpen(true)}}className="signup-or-forgot__button">Forgot Password</button>
            <Popup open={forgotOpen} position="center center" closeOnDocumentClick={false} className="signup-or-forgot__popup">
             <form className="signup-or-forgot__popup" onSubmit={(e) => { forgotPassword(e) }}>
             <button className="signup-or-forgot__popup--close" onClick={() => setForgotOpen(false)}>Close</button>
             <input type="text" name="email" placeholder='enter your email' className="signup-or-forgot__input" required></input>
             <input type="submit" placeholder="Send reset email" className="signup-or-forgot__submit"></input>
             </form>
             </Popup>

        </>
    )
}
export default SignIn;
