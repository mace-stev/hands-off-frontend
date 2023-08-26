import "./PostForm.scss"
import OBSWebSocket from 'obs-websocket-js';
import Popup from 'reactjs-popup'
import {useState} from 'react'
import 'reactjs-popup/dist/index.css'
const obs = new OBSWebSocket();

function PostForm(){
    const [open, setOpen] = useState(false);
    function popupHandler(data){
        console.log(data.outputState)
        if(data.outputState=== "OBS_WEBSOCKET_OUTPUT_STOPPING"){
        setOpen(true);
        }
    }
    async function OBS(port, url, password){
        await obs.connect(`ws://${url}:${port}`, password);
         const recordingFolder= await obs.call('GetRecordDirectory')
         console.log(recordingFolder)
         
         await obs.on('StreamStateChanged', (data)=>popupHandler(data))
}
    return(<>
    <form className="PostForm__OBS-server" onSubmit={(e)=>{
        e.preventDefault()
       console.log (e.target['server-url'].value)
       OBS(e.target['server-port'].value, e.target['server-url'].value, e.target['server-password'].value )
    }}>
    <input type='text' name='server-port' placeholder="port"></input>
    <input type= 'text' name='server-url' placeholder="url"></input>
    <input type ='text' name= 'server-password' placeholder="password"></input>
    <button type='submit'></button>
    </form>
    <Popup open={open} position="center center">
        <form className="postForm__popup">
            <input type="text" name ="video-title" placeholder='The title of your video'></input>
            <input type="text" name ="video-description" placeholder='The description of your video'></input>

        </form>
    </Popup>
    
    </>)
}
export default PostForm;