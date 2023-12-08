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



function PostForm() {
  const navigate = useNavigate();
  const location = useLocation()
  const state = location.state
  const obs = new OBSWebSocket();




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
  useEffect(() => {
    const obs_form = document.querySelector('.PostForm__OBS-server')
    const yt_button = document.querySelector('.YT-sign-in')
    if (store['access_token']) {
      obs_form.classList.remove('hidden')
      yt_button.classList.add('hidden')

    }
  }, [store['access_token']])
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
      tags: [`${e.target['video-tag1'].value}`, `${e.target['video-tag2'].value}`],
      categoryId: selectedCategory.value

    }
    setParams(store)
    await axios.post(`/api`, { recordingFolder: recordingFolder, params, snippetData }, {
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
  async function OBS(port, password) {
    try {
      const token = sessionStorage.getItem('jwt');

      const response = await axios.get(`/api/auth`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCategories(response.data['categories']);

      if (!port) {
        port = response.data['obsPort'];
      } else if (port && port !== response.data['obsPort']) {
        await axios.put(`/api/profile`, { obsPort: port }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
     await axios.post('/api/obs', { obsPort: port, password: password }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        
       alert('Sucessfully connected to OBS')
        console.log(response)
          const tempStore = Object.values((response.data));
          console.log(tempStore)
            setRecordingFolder(tempStore[0]);
            return axios.post('/api/obs/stream', {},{
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
            }).then((response)=>{
              
              setOpen(true)
            })
          }).catch((error) => {
            console.log(error)
          })
          .catch((error)=>{
            console.log(error)
          });
    } catch (error) {
      // Capture the current stack trace and attach it to the error object
      Error.captureStackTrace(error);
      console.error(error.stack);
      console.log(error);
      alert('Error connecting to OBS-Websocket Server');
    }
  }
  


  return (<>
    <form className="PostForm__OBS-server hidden" onSubmit={(e) => {
      e.preventDefault()
      OBS(e.target['server-port'].value, e.target['server-password'].value)
    }}>
      <h1>Connect To Your OBS Server</h1>

      <input type='text' name='server-port' placeholder="port"></input>
      <input type='password' name='server-password' placeholder="password" required></input>
      <button type='submit' className="PostForm__OBS--submit">Connect To OBS</button>
    </form>
    <form method="POST" className="YT-sign-in-form" action={oauth2Endpoint} onClick={(event) => trySampleRequest(event)}>
      <button type="submit" className="YT-sign-in" >Sign in to YT</button>
    </form>

    <Popup open={open} position="center center" closeOnDocumentClick={false}>

      <form className="PostForm__popup" onSubmit={(event) => popupHandler(event)}>
        <button className="PostForm__popup--close" onClick={() => setOpen(false)}>Close</button>

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
    <ol className="PostForm__instructions">
      <li>Sign in to Youtube</li>
      <li>Connect your OBS WebSocket Server; located in the tools section of OBS</li>
      <li>Start your stream</li>
      <li>Once you end your stream, return to this page</li>
      <li>Add and submit your video details to the pop-up</li>
      <li>Your video should now be uploaded.</li>
    </ol>

  </>)
}
export default PostForm;