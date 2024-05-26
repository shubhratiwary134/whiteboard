import {   useNavigate} from 'react-router-dom'
import useStore from '../storage/store.js'

import {  useEffect, useState } from 'react';


export default function InitialPage(){

   
    const [join,setJoin ] = useState(false);
    const [tempRoomId,setTempRoomId]=useState(null)
    const roomIDs=useStore((state)=>state.roomIDs)
    const isLoading = useStore((state)=>state.liveblocks.isStorageLoading)
    const setRoomID=useStore((state)=>state.setRoomID)
    const addRoomID=useStore((state)=>state.addRoomID)
    const checkRoomID=useStore((state)=>state.checkRoomID)
const navigate=useNavigate()
useEffect(() => {
    console.log('Current roomIDs:', roomIDs);
  }, [roomIDs]);

   function EnterRooms(){
    
    const newRoomId = Math.random().toString().substring(2, 7);
    setRoomID(newRoomId)
    addRoomID(newRoomId)
    if (!isLoading) {
      navigate(`/room/${newRoomId}`);
      
    }
    

}

   function joinRoom(){
    
if(checkRoomID(tempRoomId)){
    setRoomID(tempRoomId)
    console.log('entering if') 
    navigate(`/room/${tempRoomId}`)
}

else{
    window.alert('wrong input')
}
   }
    return(
        
        <>
        <div className="Rooms">

          <button onClick={EnterRooms}>create Room</button>
            <button onClick={()=>{setJoin(!join)
            }}>join a room</button>
            {join ?<div><input type='text' placeholder='enter the room Id'
            onChange={(e)=>setTempRoomId(e.target.value)}
             value={tempRoomId}></input>
              <button onClick={joinRoom}>submit</button>
             </div>:null}
             
             
           
        </div>
        </>
    )
}