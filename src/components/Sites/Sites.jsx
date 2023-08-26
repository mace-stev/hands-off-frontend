import youtube from "../../assets/youtube-logo.png";
import twitch from "../../assets/twitch_logo.webp"
import "./Sites.scss"
function Sites(){
    return(
        <>
    <h1>Sites and Requirements</h1>
    <section className="sites">
    <h2>Sites</h2>
    <h3>Currently Support:</h3>
    <ul>
        <li><a href="https://www.youtube.com/"><img src={youtube} alt="Youtube logo"/></a></li>
        <li><a href="https://www.twitch.tv/"><img src={twitch} alt="Twitch logo"/></a></li>
    </ul>
    </section>
    <section className="requirements">
        <h3>Required:</h3>
        <p>Currently in order for this to work you need to use <span><a href="https://obsproject.com/download">OBS Studio</a></span></p>
    </section>
    </>
    )
}
export default Sites;