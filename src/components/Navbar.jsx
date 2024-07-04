 import logo from '../images/don.gif.gif'
 export default function Navbar(){
    return(
        <>
            <div className="flex justify-start items-center h-1/5 ml-10 ">
                <div className='w-1/6'>
                <img src={logo} className='size-full object-cover p-0 m-0 flex' ></img>
                </div>
               
                <div >
                <p className='text-2xl'>SyncThinks</p>
                </div>
                
            </div>
        </>
    )
}