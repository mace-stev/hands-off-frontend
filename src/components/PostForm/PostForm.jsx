
import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

function PostForm(){
    async function OBS(port, url, password){
        await obs.connect(`ws://${url}:${port}`, password);
         const recordingFolder= await obs.call('GetRecordDirectory')
         console.log(recordingFolder)
         
         await obs.on("StreamStateChanged", ()=>{
            
         console.log('hi')
    })
}
    return(<>
    <form className="PostForm__server" onSubmit={(e)=>{
        e.preventDefault()
       console.log (e.target['server-url'].value)
       OBS(e.target['server-port'].value, e.target['server-url'].value, e.target['server-password'].value )
    }}>
    <input type='text' name='server-port' placeholder="port"></input>
    <input type= 'text' name='server-url' placeholder="url"></input>
    <input type ='text' name= 'server-password' placeholder="password"></input>
    <button type='submit'></button>
    </form>
    </>)
}
export default PostForm;