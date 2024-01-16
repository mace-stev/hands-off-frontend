import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./ResetPassword.scss"


function ResetPassword() {
    const { resetToken } = useParams();
    const navigate = useNavigate()
    const [jwt, setJwt] = useState()
    /* useEffect(() => {
        axios.post('/api/auth/token-valid', { resetToken: resetToken })
            .then((response) => {
                setJwt(response.headers.authorization.split(' ')[1])
            }).catch((error) => {
                
                alert('Link is invalid, please try again')
                navigate('/')
            })
    }, []) */
    function handleSubmit(e) {
        e.preventDefault();
        if (e.target['new-password'] === e.target['confirm-new-password']) {
            axios.post('/api/profile/reset-password', { password: e.target['confirm-new-password'] }, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                }
            }
            ).then((response) => {
                alert('password successfully reset')
                navigate('/')
            }).catch((error) => {
                alert('error changing password, please try again')
                e.target.reset();
            })
        }
    }



    return (<>
        <Navbar />
        <form onSubmit={(event) => handleSubmit(event)} className="reset-form">
            <input type='text' placeholder="new password" name="new-password" className="reset-input"></input>
            <input type='text' placeholder="confirm new password" name='confirm-new-password' className="reset-input"></input>
            <button type="submit" className="reset-submit" >Change Password</button>
        </form>
        <Footer />
    </>)
}
export default ResetPassword