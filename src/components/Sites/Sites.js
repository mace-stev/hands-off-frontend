import youtube from "../../assets/youtube-logo.png";
import twitch from "../../assets/twitch_logo.webp"
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./Sites.scss"
function Sites() {
    return (
        <>
            <Navbar/>
            <section className="sites">
            <h1 className="sites-title">Sites and Requirements</h1>
            <h2>Sites:</h2>
            <h3>Currently Support:</h3>
            <section className="sites-logo__container">
                <a href="https://www.youtube.com/"><img src={youtube} alt="Youtube logo" className="sites-logo" /></a>
                <a href="https://www.twitch.tv/"><img src={twitch} alt="Twitch logo" className="sites-logo" /></a>
            </section>
        </section >
            <section className="requirements">
                <h3>Required:</h3>
                <p>Currently in order for this to work you need to use <span><a href="https://obsproject.com/download">OBS Studio</a></span></p>
            </section>
            <Footer/>
    </>
    )
}
export default Sites;