import {   useNavigate} from 'react-router-dom'
import useStore from '../storage/store.js'
import logo from '../images/backgroundWeb.gif'
import {  useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';


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
        <Navbar></Navbar>
        <div className=' text-black flex justify-around items-center'>
            <div className=''>
                <img src={logo}></img>
            </div>
          <button onClick={EnterRooms} className='shadow-[inset_0_0_0_2px_#616467] text-white px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200  '>Create Room</button>
          <div>
          <button onClick={()=>{setJoin(!join)
            }} className='  shadow-[inset_0_0_0_2px_#616467] text-white px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 flex justify-around'>Join Room 
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
            </button></div>
            {join ?<div className='flex flex-col p-2'><input className='p-1 my-1 bg-black text-white border-b-2 focus:outline-none ' type='text' placeholder='Enter The RoomID'
            onChange={(e)=>setTempRoomId(e.target.value)}
             value={tempRoomId}></input>
              <button onClick={joinRoom} className='shadow-[inset_0_0_0_2px_#616467] text-white my-4  py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 '>submit</button>
             </div>:null}
            
             
             
           
        </div>
        </>
    )
}