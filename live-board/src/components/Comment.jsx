
import { useState,useEffect } from 'react'
import useStore from '../storage/store'

export default function Comment({threadId,x,y}){
    const updateThread=useStore((state)=>state.updateThread)
    const globalCommentValue = useStore((state) => state.commentValues[threadId] || '')
    const setCommentValue=useStore((state)=>state.setCommentValue)
    const [localCommentValue,setLocalCommentValue]=useState(globalCommentValue)
    useEffect(() => {
        setLocalCommentValue(globalCommentValue);   
      }, [globalCommentValue])
      function handleInputChange(e){
        const value = e.target.value;
        setLocalCommentValue(value);
        updateThread(threadId, value);
        setCommentValue(threadId, value);
      }

    function handleSubmit(){
        updateThread(threadId,localCommentValue)
        setCommentValue(threadId,localCommentValue)
        
    }
   
    return (
        <>
        <div style={{width:'100px',height:'100px',top:`${x}px`,left:`${y}px`,position:'absolute',border: '1px solid black'}}>
        <textarea  onChange={handleInputChange} value={localCommentValue}></textarea>
       <button onClick={handleSubmit}>submit</button>
       
        </div>
        
        </>
    )
}