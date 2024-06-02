 import logo from '../images/don.gif.gif'
 export default function Navbar(){
    return(
        <>
            <nav className="flex justify-start h-1/4 ml-20">
                <img src={logo} className='max-w-full object-cover p-0 m-0' ></img>
            </nav>
        </>
    )
}