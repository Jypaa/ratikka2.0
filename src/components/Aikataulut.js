const Aikataulu =({ajat})=>{

    let aika=new Date(new Date().getTime()).toLocaleTimeString('fi-FI', { timeZone: 'Europe/Helsinki', hour12: false, })
    aika = aika.replaceAll('.',':')
    if(ajat >= aika && ajat < "23:59:59"){
            return(
            <div className="pysakki">
                <time>{ajat.slice(0,5)}</time>
            </div>
        )
    }
    else{
        return null
    }
}    
       
export default Aikataulu