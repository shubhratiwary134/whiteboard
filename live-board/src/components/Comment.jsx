
import { useState,useEffect } from 'react'
import useStore from '../storage/store'

export default function Comment({threadId,x,y}){
    const updateThread=useStore((state)=>state.updateThread)
    const globalCommentValue = useStore((state) => state.commentValues[threadId] || '')
    const setCommentValue=useStore((state)=>state.setCommentValue)
    const [localCommentValue,setLocalCommentValue]=useState(globalCommentValue)
    const DissolveMovementPointerDown=useStore((state)=>state.DissolveMovementPointerDown)
    const DissolveMovementPointerMove=useStore((state)=>state.DissolveMovementPointerMove)
    const DissolveMovementPointerUp=useStore((state)=>state.DissolveMovementPointerUp)
   
    const [dissolve,setDissolve]=useState(false)
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
    function handleDissolve(){
      setDissolve(!dissolve)
    }
    function handlePointerDown() {
      DissolveMovementPointerDown();
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
  }

  function handlePointerMove(e) {
      DissolveMovementPointerMove(threadId, e);
  }

  function handlePointerUp() {
      DissolveMovementPointerUp();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
  }
   
    return (
        <>
        <div style={{width:'100px',height:'100px',top:`${y}px`,left:`${x}px`,position:'absolute'}}
        onPointerDown={handlePointerDown}
        >
          <button className='rounded w-10 bg-gray-200' onClick={handleDissolve}  ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Z"/></svg></button>
          {dissolve && <div >
            <textarea  onChange={handleInputChange} value={localCommentValue}></textarea>
           <button onClick={handleSubmit}>submit</button>
          </div>
          }
        
      
      
        </div>
        
        </>
    )
}