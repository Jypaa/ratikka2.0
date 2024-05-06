const Aikataulu =({ajat})=>{

    let aika=new Date(new Date().getTime()).toLocaleTimeString('fi-FI', { timeZone: 'Europe/Helsinki', hour12: false, })
    aika = aika.replace('.',':')
    if(ajat >= aika && ajat < "23:59:59"){
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