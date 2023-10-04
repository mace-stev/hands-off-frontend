import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { useNavigate, useLocation } from "react-router-dom";

import axios from 'axios'
import "./SignIn.scss"



function SignIn() {
    const [open, setOpen] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
    const loggedIn = false
    

    
    function popupHandler(e) {
        e.preventDefault()
        
      
        

    }
    function signinHandler(e) {
        e.preventDefault()
        
    }
    return (
        <>
            <form className="sign-in-form" onSubmit={(e) => { signinHandler(e) }}>
                <input className="sign-in-form__username" name="username" required placeholder="username"></input>
                <input type="password" className="sign-in-form__password" name="password" required placeholder="password"></input>
                <button type="submit" placeholder="Login" className="sign-in-form__login">Login</button>
            </form>
            <button placeholder="Sign-up?" onClick={(e) => {
                e.preventDefault()
                setOpen(true)
            }} className={"signup-button"}>Sign-Up?</button>
            <Popup open={open} position="center center" closeOnDocumentClick={false} className="signup_popup">
                <form className="signup__popup" onSubmit={(e) => { popupHandler(e) }}>
                    <button onClick={() => setOpen(false)}>Close</button>
                    <input type="text" name="account" placeholder='username' required></input>
                    <input type="password" name="password" placeholder='password' required></input>
                    <input type='file' name="saveFile" placeholder='Where do you want to save your profile?' className="signup__popup--saveDir" directory="" webkitdirectory="" multiple></input>
                    <input type="submit" placeholder="Create Profile"></input>
                </form>
            </Popup>

        </>
    )
}
export default SignIn;