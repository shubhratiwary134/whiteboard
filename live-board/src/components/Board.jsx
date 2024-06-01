import useStore from '../storage/store'
import Comment from './Comment'
import CursorDisplays from './CursorDisplays'
import { useEffect, useRef, useState} from 'react'
import rough from 'roughjs/bundled/rough.cjs.js'


 export default function Board(){
    const shapes=useStore((state)=>state.shapes)
  const forPointerUp=useStore((state)=>state.forPointerUp)
  const forPointerMove=useStore((state)=>state.forPointerMove)
  const clearRect=useStore((state)=>state.clearRect)
  const deleteRect=useStore((state)=>state.deleteRect)
 const others=useStore((state)=>state.liveblocks.others)
 const shapeSelected=useStore((state)=>state.shapeSelected)
 const undo = useStore((state)=>state.liveblocks.room?.history.undo)
 const redo = useStore((state)=>state.liveblocks.room?.history.redo)
 const cursorMovement=useStore((state)=>state.cursorMovement)
 const cursorLeave=useStore((state)=>state.cursorLeave)
 const setSelection=useStore((state)=>state.setSelection)
 const continueDrawing=useStore((state)=>state.continueDrawing)
 const stopDrawing=useStore((state)=>state.stopDrawing)
 const setTypeRect=useStore((state)=>state.setTypeRect)
 const setTypeLine=useStore((state)=>state.setTypeLine)
 const selectShape=useStore((state)=>state.selectShape)
 const startDrawing=useStore((state)=>state.startDrawing)
const selection=useStore((state)=>state.selection)
const isDragging=useStore((state)=>state.isDragging)
const setPen=useStore((state)=>state.setPen)
const roomID=useStore((state)=>state.roomID)
const drawing = useStore((state)=>state.drawing)
const getRandomInt=useStore((state)=>state.getRandomInt)
const threads=useStore((state)=>state.threads)
 const canvasRef=useRef(null)
const addThreads=useStore((state)=>state.addThreads)
 useEffect(()=>{
  const canvas=canvasRef.current
  const ctx=canvas.getContext('2d');
   ctx.lineWidth=3;
   const roughCanvas=rough.canvas(canvas)
    ctx.clearRect(0,0,canvas.width,canvas.height)
   Object.entries(shapes).map(([shapeId,shape])=>{
    let borderColor='white'
    if(shapeSelected===shapeId){
      borderColor='blue'
    }
    else if(others.some((user)=>user.presence.shapeSelected===shapeId)){
      borderColor='green'
    }
    printRectangle(shape,borderColor,ctx,roughCanvas)
  })

 },[shapes,shapeSelected,drawing,others])
 
 



 function printRectangle(shape,borderColor,ctx,roughCanvas){
  if(shape.type=='rectangle'){
    roughCanvas.rectangle(shape.x,shape.y,shape.width,shape.height,{roughness:1.5,stroke:borderColor,strokeWidth:2})

  }
  else if(shape.type=='line'){
    roughCanvas.line(shape.x,shape.y,shape.x2,shape.y2,{
      stroke:'white',
      strokeWidth:2
    })  
  }
  else if (shape.type === 'pen' && shape.path  && Array.isArray(shape.path) ) {
    if(shape.path.length>0){
    ctx.strokeStyle = 'white'
    ctx.beginPath();
    ctx.moveTo(shape.path[0].x, shape.path[0].y)
    shape.path.forEach(point => ctx.lineTo(point.x, point.y))
    ctx.stroke()
    }
}
 }
 function addComment(){
  const x = getRandomInt(600)
  const y = getRandomInt(600)
  const threadId=Date.now().toString()
 addThreads(threadId,'',x,y)
 }
    return (
    
        <div onPointerMove={cursorMovement} onPointerLeave={cursorLeave}>
         
          {others.map((user)=>{
        const othersCursor=user.presence
        if(othersCursor==null){
          return
        }
        return(
          <>
          <CursorDisplays x={othersCursor.cursor.x} y={othersCursor.cursor.y} color='blue' className='cursor-display'></CursorDisplays>
          </>
        )
      })}
          <div className='canvas'>
          
       <canvas ref={canvasRef} width={window.innerWidth-50} height={window.innerHeight-50} 
       onPointerDown={(e)=>{
        if(selection){
          selectShape(e)
        }else{
          startDrawing(e)
          
        }
        
       }}
       onPointerMove={(e)=>{
        if(isDragging){
          forPointerMove(e)
        }else{
          
          continueDrawing(e)
        }
       }}
       onPointerUp={()=>{
        if(selection){
          forPointerUp()
        }else{
          stopDrawing()
        }
       }}

       >
        
       </canvas>
      
      
         <div className='roomID'><p>
          {roomID}
            </p></div>
            
          </div>
          <div className='toolbar' >
            <button onClick={setTypeRect}>rectangle</button>
            <button onClick={setTypeLine}>line</button>
            <button onClick={setPen}>Pen</button>
            <button onClick={setSelection}>selection</button>
            <button onClick={clearRect}>clear</button>
            <button onClick={deleteRect}>delete</button>
            <button onClick={undo}>undo</button>
            <button onClick={redo}>redo</button>
            <button onClick={addComment}>Add comment</button>
          </div>
          {Object.entries(threads)
    .map(([threadId, thread]) => (
        <Comment key={threadId} x={thread.x} y={thread.y} />
    ))}
        </div>
        
      )
}

// {Object.entries(shapes).map(([shapeId,shape])=>{
//   let borderColor='white'
//   if(shapeSelected===shapeId){
//     borderColor='blue'
//   }
//   else if(others.some((user)=>user.presence.shapeSelected===shapeId)){
//     borderColor='green'
//   }
//   return(
//    <Rectangle key={shapeId} id={shapeId} shape={shape} borderColor={borderColor}></Rectangle>
//   )
  
// })}