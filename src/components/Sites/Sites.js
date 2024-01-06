import youtube from "../../assets/youtube-logo.png";
import twitch from "../../assets/twitch_logo.webp"
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useState, useEffect } from 'react';
import "./Sites.scss"
function Sites() {
    const [ngrokCommand, setNgrokCommand] = useState()
    const [ngrokConfig, setNgrokConfig] = useState()
    function ngrokFormHandler(input) {
        input.preventDefault()
        const fullCommand = `ngrok http ${input.target['obs-port'].value} --domain ${input.target['ngrok-domain'].value}`
        setNgrokCommand(fullCommand)
        const fullConfig = `
        tunnels:
            website:
                addr: ${input.target['obs-port'].value}
            schemes:
                - https
            host_header: "${input.target['ngrok-domain'].value}"
            proto: http
            domain: ${input.target['ngrok-domain'].value}
        `
        setNgrokConfig(fullConfig)
    }
    function copyText(textId) {
        // Get the text to copy
        const textToCopy = document.getElementById(textId).innerText;

        // Use the Clipboard API to write text to clipboard
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log('Text copied to clipboard!');
                // Optionally, provide feedback to the user
                alert('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Unable to copy text: ', err);
            });
    }

    return (
        <>
            <Navbar />
            <section className="sites">
                <section className="sites-title__container">
                <h1 className="sites-title">Sites and Requirements</h1>
                <h2>Sites:</h2>
                <h3>Currently Support:</h3>
                </section>
                <section className="sites-logo__container">
                    <a href="https://www.youtube.com/"><img src={youtube} alt="Youtube logo" className="sites-logo" /></a>
                    <a href="https://www.twitch.tv/"><img src={twitch} alt="Twitch logo" className="sites-logo" /></a>
                </section>
                <section className="requirements">
                    <h3>Required:</h3>
                    <p>Currently in order for this to work you need to use <span><a href="https://obsproject.com/download">OBS Studio</a></span></p>
                    <p>Currently in order for this to work you also need some type of tunnel service for the website version only. This won't be needed for the desktop version. Scroll down for a guide and I'll explain.</p>
                </section>
                <section className="website-guide">
                    <h2>Website/Tunnel Guide</h2>
                    <h3>Reasons for using a tunnel service <span>Click <a href="#tutorial">here</a> to skip to the guide</span></h3>
                    <ul className="website-guide__list">
                        <li>
                            <p>If a tunnel service isn't used you cannot connect to your local OBS server in all browsers due to the connection being unsecured.</p>
                        </li>
                        <li>
                            <p>The tunnel service in this case will provide a secure way to transmit data from your OBS server to this site and also your social-media accounts</p>
                        </li>
                    </ul>
                    <h3 id="tutorial">Easiest Way To Make a Tunnel</h3>
                    <p>The easiest way I recommend is ngrok, but bear with me, there is some initial setup</p>
                    <a href="https://ngrok.com/download">Download Here</a>
                    <form onSubmit={(e) => { ngrokFormHandler(e) }}>
                        <div className="tutorial__slider">
                            <a href="#after-ngrok-download">1</a>
                            <a href="#create-ngrok-account">2</a>
                            <a href="#find-your-AuthToken">3</a>
                            <a href="#find-ngrok-domains-section">4</a>
                            <a href="#find-obs-websocket-server-settings">5</a>
                            <a href="#submit-form-generate-ngrok-command">6</a>
                            <a href="#ngrok-config-file">7</a>
                            <a href="#last-steps">8</a>
                            <div className="tutorial__slides">
                                <div id="after-ngrok-download">
                                    <ul>
                                        <li>Go to your downloads and find the most recent download which should be the compressed ngrok file.</li>
                                        <li>Right-click the downloaded file and select "Extract All.." to unzip it.</li>
                                        <li>Choose where you want ngrok, I recommend the desktop</li>
                                    </ul>
                                </div>
                                <div id="create-ngrok-account">Go to ngrok's sign-up page and create an account <span><a href="https://dashboard.ngrok.com/login"> here</a></span></div>
                                <div id="find-your-AuthToken">
                                    <ul>
                                        <li>Login and find "Your AuthToken" in the "Getting Started" section.</li>
                                        <li>In the command-line section, copy the shown command. Keep the window open.</li>
                                        <li>Now open your ngrok app and you should see a terminal; paste the command from earlier and enter it</li>
                                    </ul>
                                </div>
                                <div id="find-ngrok-domains-section">
                                    <ul>
                                        <li>Go back to ngrok one last time and click "Cloud Edge" followed by "Domains"</li>
                                        <li>Click the free domain ngrok gives you and a side-bar should appear. Copy the domain at the top and paste it in the domain section here</li>
                                    </ul>
                                    <input type="text" name="ngrok-domain" placeholder="ngrok domain you copied" className="sites__input"></input>
                                </div>
                                <div id="find-obs-websocket-server-settings"><ul>
                                    <li>Now open Obs Studio and go to the tools section followed by going to "WebSocket Server Settings"; enable the server if you haven't already</li>
                                    <li>In "Show Connect Info," copy and paste the port number below.</li>
                                </ul>
                                    <input type="text" name="obs-port" placeholder="obs port you copied" className="sites__input"></input>
                                </div>
                                <div id="submit-form-generate-ngrok-command">
                                    <button type="submit" className="sites__submit">Generate Ngrok Command</button>
                                    <section className="sites-copy__container">
                                        <button className="sites-copy__button" onClick={() => { copyText("ngrok-command") }}>Copy</button>
                                        <p id="ngrok-command">If you want to manually start an ngrok tunnel each time you can use this command: {ngrokCommand}</p>
                                    </section>
                                    <h3>Otherwise continue to figure out how to automatically start a tunnel...</h3>
                                </div>
                                <div id="ngrok-config-file">
                                    <ul>
                                        <li>Find the ngrok app, right-click and then select run as administrator</li>
                                        <li>type "ngrok config edit" in the terminal and you should now see a notepad</li>
                                        <li>Copy and paste the tunnel config and edit the tunnel name, "website" if you would like</li>
                                    </ul>
                                    <section className="sites-copy__container">
                                        <button className="sites-copy__button" onClick={() => { copyText("ngrok-config") }}>Copy</button>
                                        <h3 id="ngrok-config"><pre>{ngrokConfig}</pre></h3>
                                    </section>
                                </div>
                                <div id ="last-steps">
                                    <ul>
                                        <li>If you didn't change the name of your config file for ngrok, the correct command to run now should be "ngrok service install --config C:\ngrok\ngrok.yml"</li>
                                        <li>The last step to start the service is to run "ngrok service start", and if for whatever reason the service turns off you can just run the same command again.</li>
                                        <li>And with that now completed the ngrok tunnel should start automatically, so you can just type in your obs info and connect without having to worry about manually running the tunnel.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>

                </section>
            </section >
            <Footer />
        </>
    )
}
export default Sites;