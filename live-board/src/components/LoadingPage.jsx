import Loading from '../images/LoadingGif.gif'
export default function LoadingPage(){
    return(
        <>
        <div className="size-full bg-[#191919] flex flex-col justify-center items-center">
       
            <img src={Loading} className='size-full object-contain'></img>
            
        </div>
        </>
    )
}