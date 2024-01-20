import "./Footer.scss"
function Footer(){
    return(
    <section className="footer">
    <h1 className="footer__title">About Me</h1>
    <p>I'm a software-engineer but also an avid watcher of streams, and I made this project mostly just to help out my favorite content-creators.</p>
    <h3 className="footer_subheader">Contact Me:</h3>
    <ul className="footer__list">
        <li><a href="https://www.linkedin.com/in/william-stevenson-b84704225/" className="footer__link">Linkedin</a></li>
        <li><a href="mailto:williamstevenson107@gmail.com" className="footer__link">Email Me</a></li>
        <li><a href="/terms-and-conditions" className="footer__link">Terms and Conditions</a></li>
        <li><a href="/privacy-policy" className="footer__link">Privacy Policy</a></li>
    </ul>
    </section>)
}
export default Footer;