const Aikataulu =({ajat})=>{

    let aika=new Date(new Date().getTime()+120 *60000).toLocaleTimeString('en-GB', { timeZone: 'UTC' })
 
    if(ajat >= aika){
            return(
            <ul className="pysakki">       
                {ajat.slice(0,5)}
            </ul>
        )
    }
    else{
        return(<p></p>)
    }
}    
       
export default Aikataulu