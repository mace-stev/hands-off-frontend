import "./PostForm.scss";
import OBSWebSocket from 'obs-websocket-js';
import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom"
import bcrypt from "bcryptjs"
import Select from "react-select";


/*  */

const obs = new OBSWebSocket();

function PostForm() {
    const navigate = useNavigate();
    const location = useLocation()
    const state = location.state

    const sessionState = sessionStorage.getItem('oauth2-state')

    const [params, setParams] = useState(JSON.parse(process.env.REACT_APP_PARAMS));
    params['state'] = state;
    const [open, setOpen] = useState(false);
    const [recordingFolder, setRecordingFolder] = useState();
    const [fileName, setFileName] = useState();
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const [store, setStore] = useState([]);

        const [selectedCategory, setSelectedCategory] = useState('23');
        const [categories, setCategories] = useState([]);
        const handleCategorySelection = (selectedOption) => {
          setSelectedCategory(selectedOption);
        };
        console.log(sessionStorage.getItem('jwt'))

    ////////OAuth////////////////////////////////////////////////////////////////////
    // Google's OAuth 2.0 endpoint for requesting an access token
    useEffect(() => {

        setStore(params)
        if (typeof (state) === 'string') {
            sessionStorage.setItem('oauth2-state', state)
        }

        const fragmentString = window.location.hash.substring(1);
        // Parse query string to see if page request is coming from OAuth 2.0 server.
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
        // Parameters to pass to OAuth 2.0 endpoint.
    }, [])
    async function verifyState(stateToCheck) {

        if (stateToCheck) {
            const sessionState = sessionStorage.getItem('oauth2-state')
            return await bcrypt.compare(stateToCheck, sessionState).then((response) => {
                return response
            })
        }
    }

    async function trySampleRequest(e) {
        setParams(JSON.parse(localStorage.getItem('oauth2-test-params')));
        setStore(params)
        const stateIsValid = verifyState(params['state'])
        if (params && params['access_token'] && stateIsValid === 'true') {
            const xhr = new XMLHttpRequest();
            xhr.open('POST',
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
        e.target.submit();

    }

    ////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////
    /////Function to post the video to Youtube//////////////////////////////////////////////
    async function popupHandler(e) {
        e.preventDefault()
        const token = sessionStorage.getItem('jwt');
        const snippetData = {
            title: e.target['video-title'].value,
            description: e.target['video-description'].value,
            tags: [`${e.target['video-tag1']}`, `${e.target['video-tag2']}`],
            categoryId: selectedCategory.value

        }
        setParams(store)
        await axios.post(`http://localhost:3000/api`, { recordingFolder, params, snippetData }, {
            headers: {
                'Authorization': `Bearer ${store['access_token']} ${token}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response)


        }).catch((err) => { console.log(`${err}: error sending folder/video to server or to Youtube`) })

    }
    ///////////////////////////////////////////////////////////////////////////
    ////////////OBS////////////////////////////////////////////////////////////
    async function OBS(port, url, password) {
        const token = sessionStorage.getItem('jwt');
        await axios.get("http://localhost:3000/api/auth",{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then((response)=>{
            setCategories(response.data)
           
        }).catch((err)=>{
            console.log(err+" error getting youtube vid categories")
        })
        await obs.connect(`ws://${url}:${port}`, password).then((response) => {
           
            alert("Successfully connected to the server");
        }).catch((err) => {
            console.log(err)
            alert("error connecting to OBS-Websocket Server; check your websocket server credentials");
        });
        const recordingFolder = await obs.call('GetRecordDirectory')



        await obs.on('StreamStateChanged', (data) => {

            if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPING") {
                setOpen(true);
                const tempStore = Object.values(recordingFolder)
                setRecordingFolder(tempStore[0])

                //open is the state variable used to trigger the popup.
            }
        })

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
        <form method="POST" action={oauth2Endpoint} onClick={(event) => trySampleRequest(event)}>
            <button type="submit" className="YT-sign-in" >Sign in to YT</button>
        </form>
        
        <Popup open={open} position="center center" closeOnDocumentClick={false}>
            
            <form className="PostForm__popup" onSubmit={(event) => popupHandler(event)}>
                <button onClick={() => setOpen(false)}>Close</button>

                <input type="text" name="video-title" placeholder='The title of your video' className="video-input"></input>
                <input type="text" name="video-description" placeholder='The description of your video' className="video-input"></input>
                <input type="text" name="video-tag1" placeholder='A tag for your video' className="video-input"></input>
                <input type="text" name="video-tag2" placeholder='A tag for your video' className="video-input"></input>
                <Select
                    id="videoCategory"
                    name="category"
                    options={categories}
                    defaultValue={'22'}
                    onChange={handleCategorySelection}
                    placeholder="Select a category"
                    className="video-input"
                    required
                />
                <label htmlFor="videoCategory"></label>
                <button type="submit">Post Video to Youtube</button>
            </form>
        </Popup>

    </>)
}
export default PostForm;