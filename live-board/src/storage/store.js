import {create} from 'zustand'
import { createClient } from "@liveblocks/client";
import { liveblocks } from '@liveblocks/zustand'

const client = createClient({
publicApiKey: import.meta.env.VITE_API_KEY
})




const useStore=create()(
    liveblocks(
        (set,get)=>({
            shapes:{},
            threads:{},
            roomID:null,
            roomIDs: JSON.parse(localStorage.getItem('roomIDs')) || [],
            shapeSelected:null,
            isDragging:false,
            drawing:false,
            type:'rectangle',
            cursor:{x:0,y:0},
            selection:false,
            commentValues:{},
            commentDragging:false,
           
            DissolveMovementPointerDown:()=>{
               
                set({commentDragging:true})  
               
            },
            DissolveMovementPointerMove:(threadId,e)=>{
                const {commentDragging}=get()
                const {threads}=get()
                const thread=threads[threadId]
                if(!commentDragging){
                    return
                }
                set({
                    threads:{...threads,
                    [threadId]:
                    {...thread,
                        x:e.clientX,
                        y:e.clientY
                    }}})
            },
            DissolveMovementPointerUp:()=>{
                set({commentDragging:false})
            },
            setCommentValue:(threadId,commentValue)=>{
                const {commentValues}=get()
                set({commentValues:{...commentValues,[threadId]:commentValue}})
            },
            getRandomInt:(max)=>{
                const x = Math.floor(Math.random()*max)
                return x
            },

            addThreads:(threadId,text,x,y)=>{
                const {threads}=get()
                const thread={
                    text: text,
                    x:x,
                    y:y
                }
                set({threads:{...threads,[threadId]:thread}})
               console.log(threads)
            },
            updateThread:(threadId,text)=>{
                const {threads}=get()
                
                set({threads:{...threads,
            [threadId]:{...threads[threadId],
                text:text
            }}})
            console.log(threads)
            
         
            },
            deleteThreads:(threadId)=>{
                const {threads}=get()
               const newThreads={...threads}
               delete newThreads[threadId]
               set({
                threads:newThreads
               })
            },
         

            setSelection:()=>{
                set({selection:true})
            },
            setRoomID:(roomID)=>{
                set({roomID})
            },
            addRoomID:(roomID)=>{
                const {roomIDs}=get()
                const newRoomIDs = [...roomIDs, roomID]
        localStorage.setItem('roomIDs', JSON.stringify(newRoomIDs))
        set({ roomIDs: newRoomIDs })
       
            },

            checkRoomID:(roomID)=>{
                const {roomIDs}=get()
                return roomIDs.includes(roomID)
            },
            
            startDrawing:(e)=>{  
                set({drawing:true})
                const {type}=get()
                const shapes=get().shapes
                const shapeId = Date.now().toString()
                let shape 
                if(type==='rectangle'){
                     shape={
                        shapeId,
                        x:e.clientX,
                        y:e.clientY,
                        width:0,
                        height:0,
                        fill:'blue',
                        type:'rectangle'
                    }
                   
                }
                if(type==='line'){
                     shape={
                        shapeId,
                        x:e.clientX,
                        y:e.clientY,
                        x2:e.clientX,
                        y2:e.clientY,
                        stroke:'white',  
                        type:'line'
                    }
                   
                }
                if(type==='pen'){
                    
                    shape={
                        shapeId,
                       x:e.nativeEvent.offsetX,
                       y:e.nativeEvent.offsetY,
                        stroke:'white',
                        type:'pen',
                        path:[{x:e.nativeEvent.offsetX,y:e.nativeEvent.offsetY}]
                    }
          
                    
                }
                set({
                    shapes:{...shapes,[shapeId]:shape},
                    shapeSelected:shapeId,
                   })    
                   get().liveblocks.room?.history.pause()
                        
            },
            setTypeRect:()=>{
                   set({
                    type:'rectangle',
                    selection:false
                   }) 

            },
            setTypeLine:()=>{
                set({
                    type:'line',
                    selection:false
                })
            },
            setPen:()=>{
                set({
                    type:'pen',
                    selection:false
                })
            },
            continueDrawing:(e)=>{
                const {shapes,shapeSelected,drawing}=get()       
               const shape=shapes[shapeSelected]
            
                if(drawing===false){
                    return
                }
                if(shape.type=='rectangle'){
               set(
              {
                shapes:{...shapes,
                    [shapeSelected]:
                    {...shape,
                        width:e.clientX-shape.x,
                        height:e.clientY-shape.y
                    }}
              }
               )
            }
               if(shape.type=='line'){
                set(
                    {
                        shapes:{...shapes,
                            [shapeSelected]:{
                                ...shape,
                                x2:e.clientX,
                                y2:e.clientY
                            }}
                    }
                )
               }
               else if (shape.type === 'pen') {   
                const newPath = [...shape.path, { x: e.clientX, y: e.clientY }]
                set({
                    shapes:{...shapes,
                        [shapeSelected]:{
                            ...shape,
                            path:newPath
                    }}
                })
               }
            } ,
            stopDrawing:()=>{       
                set({drawing:false}) 
                set({ path: [] }) 
                get().liveblocks.room?.history.resume()
               
            },
            selectShape:(e)=>{
                const {shapes}=get()
                
                const shapeSelected=Object.keys(shapes).find(shapeId =>{
                    const shape=shapes[shapeId]
                    if(shape.type==='rectangle'){
                        return e.clientX >= shape.x && e.clientX <= shape.x + shape.width &&
                        e.clientY >= shape.y && e.clientY <= shape.y + shape.height;
                    }
                    if(shape.type ==='line'){
                       
                        
                        const distance = Math.sqrt((e.clientX - shape.x) * 2 + (e.clientY - shape.y) * 2);
                        return distance < 10; 
                        
                        
                    }
                    return false
                })
                if(shapeSelected){
                    set({shapeSelected,isDragging:true})
                } else {
                    set({ shapeSelected: null, isDragging: false }); 
                }
                console.log(shapeSelected)
                
            },
            cursorMovement:(e)=>{
                set({
                    cursor:{
                       x:e.clientX,
                       y:e.clientY
                    }
                })  
            },
            cursorLeave:()=>{
                set({
                    cursor:{
                        x:0,
                        y:0
                    }
                })
            },
            
            
            clearRect:()=>{
                set({
                    shapes:{}
                })
                set({
                    threads:{}
                })
            },
            selectParticularShape:(shapeId)=>{
               
                set({shapeSelected:shapeId,isDragging:true})
            },
           forPointerUp:()=>{
            get().liveblocks.room?.history.resume()
            set({isDragging:false})    
           },
           forPointerMove:(e)=>{
            e.preventDefault()
            const {shapes,shapeSelected}=get()
            const shape=shapes[shapeSelected]
            if(shapeSelected==null){
                return
            }
            
            if(shapeSelected){
                get().liveblocks.room?.history.pause()
                if(shape.type==='rectangle'){
                    set({
                        shapes:{
                        ...shapes,
                        [shapeSelected]:{
                            ...shape,
                            x:e.clientX-shape.width/2,
                            y:e.clientY-shape.height/2
                        }
                    }
                    })
                }
               if(shape.type==='line'){
                const dx = shape.x2 - shape.x;
              const dy = shape.y2 - shape.y;
                set({
                    shapes:{
                        ...shapes,
                        [shapeSelected]:{
                            ...shape,
                            x: e.clientX,
                                y: e.clientY,
                                x2: e.clientX + dx,
                                y2: e.clientY + dy,
                        }
                    }
                })
               }
            }

           },
            
            deleteRect:()=>{
                const {shapes,shapeSelected}=get()
                
                if(shapeSelected==null){
                    return
                }
                const newShapes={...shapes}
                delete newShapes[shapeSelected]
              set(()=>({
                shapeSelected:null,
                shapes: newShapes
              }))
            }
        }
        
    ),
        
        {
            client,
            storageMapping:{shapes:true,roomIDs:true,path:true,threads:true,commentValues:true},
            presenceMapping:{shapeSelected:true,cursor:true,commentDragging:true}
        }
    )
)
export default useStore