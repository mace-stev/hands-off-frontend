import { NavLink } from "react-router-dom"
import logo from "../../assets/Hands-Off-logo.jpg"
import "./Navbar.scss"
import {useNavigate, useLocation} from "react-router-dom"

function Navbar(){
    const location=useLocation()


    return(
    <section className="navbar">
    <NavLink to="/"><img src={logo} alt="Hands-Off Logo" className="hands-off-logo"/></NavLink>
    <h1>Hands-Off</h1>
    < NavLink to="/sites" state={location.state} className="navlink-text">Sites</NavLink>
    <NavLink to="/post" className="navlink-text" state={location.state}>Start</NavLink>
    </section>)
}
export default Navbar;