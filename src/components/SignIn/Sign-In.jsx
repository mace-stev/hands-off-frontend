import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
const keytar = require('keytar')
const { dialog } = require('electron');
const port = process.env.PORT || 80
const axios=require('axios')
import {useNavigate, useLocation} from "react-router-dom"
function SignIn(){
    const [open, setOpen] = useState(false);
    const location =useLocation()
    const navigate=useNavigate()
   const loggedIn=location.state()
    
    function popupHandler(e){
        e.preventDefault()
        fileName=e.target.name.saveFile
        setPassword('hands-off', e.target.name.username, e.target.name.password)
        axios.post(`${BACKEND_URL}:${port}/profile`, {fileName}, {
            headers: {
        
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response)
            
          
        })
    }
    function signinHandler(e){
        e.preventDefault()
        getPassword('hands-off', e.target.username)
        .then((data)=>{
            if(data.response===e.target.password){
                setLoggedIn(true)
            }
            alert('Wrong, try again')
            return
        })
    }
    return(
        <>
        <form className="sign-in" onSubmit={(e)=>{signinHandler(e)}}>
            <input className="username" name="username"required></input>
            <input type="password" className="password" name="password" required></input>
            <button type="submit" placeholder="Login"></button>
        </form>
        <button type="submit" placeholder="Sign-up?" onSubmit={setOpen(true)}></button>
        <Popup open={open} position="center center" closeOnDocumentClick={false}>
            <form className="signup__popup" onSubmit={(e)=>{popupHandler(e)}}>
                <button onClick={()=>setOpen(false)}>Close</button>
                <input type="text" name="username" placeholder='username' required></input>
                <input type="password" name="password" placeholder='password' required></input>
                <input type='button' name="saveFile" placeholder='Where do you want to save your profile?' required></input>
                <input type="submit" placeholder="Create Profile"></input>
            </form>
        </Popup>
        
        </>
    )
}