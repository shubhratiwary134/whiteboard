import { useParams } from "react-router-dom";
import useStore  from '../storage/store.js';
import { useEffect } from "react";
import Board from "./Board.jsx";

export default function Room(){
    const {roomID}=useParams()
    const enterRoom=useStore((state)=>state.liveblocks.enterRoom)
    const leaveRoom=useStore((state)=>state.liveblocks.leaveRoom)
    const isLoading=useStore((state)=>state.liveblocks.isStorageLoading)
    useEffect(()=>{
        enterRoom(roomID)
        return()=>{
            leaveRoom(roomID)
        }
    },[roomID,enterRoom,leaveRoom])
    if(isLoading){
        return(
            <div className="loading">loading...</div>
        )
    }
   
    return(
        <>
            <div className="room-container">
                <Board></Board>
            </div>
        </>
    )
}