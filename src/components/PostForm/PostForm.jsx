import "./PostForm.scss"
import OBSWebSocket from 'obs-websocket-js';
import Popup from 'reactjs-popup'
import { useState } from 'react'
import 'reactjs-popup/dist/index.css'
const obs = new OBSWebSocket();

function PostForm() {
    const [open, setOpen] = useState(false);
    const [recordingFolder, setRecordingFolder] = useState();
    const [fileName, setFileName] = useState()
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    // Parameters to pass to OAuth 2.0 endpoint.


  
    const fragmentString = window.location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    ;
    let regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
        localStorage.setItem('oauth2-test-params', JSON.stringify(params));
        if (params['state'] && params['state'] == 'try_sample_request') {
            trySampleRequest();
        }
    }

    function trySampleRequest(e) {
        const params = JSON.parse(localStorage.getItem('oauth2-test-params'));
        if (params && params['access_token']) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET',
                'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&' +
                'access_token=' + params['access_token']);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.response);
                } else if (xhr.readyState === 4 && xhr.status === 401) {
                    // Token invalid, so prompt for user permission.
                    oauth2SignIn(e);
                }
            };
            xhr.send(null);
        } else {
            oauth2SignIn(e);
        }
    }

    function oauth2SignIn(e) {
      
        for (let p in params) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            e.target.appendChild(input);
        }
        console.log("hi")
        e.target.submit()

    }

    function popupHandler(e) {
        e.preventDefault()
<<<<<<< HEAD
        console.log(recordingFolder)
        console.log(fileName)
      
=======

        await axios.post(`http://localhost:8080`, { recordingFolder }, {
            headers: {
        
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log('hi')
            const snippetData = {
                title: e.target['video-title'].value,
                description: e.target['video-description'].value,
                tags: ['tag1', 'tag2'],
                categoryId: '22'
            }
            const formData = new FormData();
        console.log(response.headers['content-length'])
        console.log(response.data.length)
            formData?.append('snippet', JSON.stringify(snippetData))
            formData?.append('file', response?.data)
        
            const params = JSON.parse(localStorage.getItem('oauth2-test-params'));
           return axios.post('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&' +
                'access_token=' + params['access_token'], formData, { headers: { 'Content-Type': `multipart/related; boundary=${formData._boundary}`, 'Access-Control-Allow-Origin': 'http://localhost:3000', "Access-Control-Allow-Methods": "POST" } })
                    .then((res) => { console.log(res.data) })
                    .catch((error) => { console.log(error) })
        }).catch((err)=>{console.log(`${err}: error sending folder/video to server or to Youtube`)})
    
>>>>>>> c48ee62 (added a node version for deployment)
    }
    async function OBS(port, url, password) {
        await obs.connect(`ws://${url}:${port}`, password).then((response) => {
            alert("Successfully connected to the server");
        }).catch((err) => {
            alert("error connecting to OBS-Websocket Server");
        });
        const recordingFolder = await obs.call('GetRecordDirectory')
      

        await obs.on('StreamStateChanged', (data) => {
            obs.call('GetRecordStatus').then((response)=>{
                setFileName(response)
             })
            if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPING"){
                setOpen(true);
                setRecordingFolder(recordingFolder)
               
                //open is the state variable used to trigger the popup.
            }})
            
    }
    return (<>
        <form className="PostForm__OBS-server" onSubmit={(e) => {
            e.preventDefault()
            console.log(e.target['server-url'].value)
            OBS(e.target['server-port'].value, e.target['server-url'].value, e.target['server-password'].value)
        }}>
            <h1>Connect To Your OBS Server</h1>
            <input type='text' name='server-port' placeholder="port" required></input>
            <input type='text' name='server-url' placeholder="url" required></input>
            <input type='text' name='server-password' placeholder="password" required></input>
            <button type='submit' className="PostForm__OBS--submit">Connect To OBS</button>
        </form>
        <form method="GET" action={oauth2Endpoint} onClick={(event) => trySampleRequest(event)}>
            <button type="submit" className="YT-sign-in">Sign in to YT</button>
        </form>

        <Popup open={open} position="center center">
            <form className="postForm__popup" onSubmit={popupHandler}>
                <input type="text" name="video-title" placeholder='The title of your video'></input>
                <input type="text" name="video-description" placeholder='The description of your video'></input>
                <button type="submit">Post Video to Youtube</button>
            </form>
        </Popup>

    </>)
}
export default PostForm;