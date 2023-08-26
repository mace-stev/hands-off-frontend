import { NavLink } from "react-router-dom"
import logo from "../../assets/Hands-Off-logo.jpg"
import "./Navbar.scss"
function Navbar(){

    return(
    <section className="navbar">
    <NavLink to="/"><img src={logo} alt="Hands-Off Logo" className="hands-off-logo"/></NavLink>
    <h1>Hands-Off</h1>
<   NavLink to="/sites" className="navlink-text">Sites</NavLink>
    <NavLink to="/post" className="navlink-text">Post</NavLink>
    </section>)
}
export default Navbar;