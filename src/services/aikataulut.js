import axios from 'axios'

const date = new Date();
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",];
let day = date.getDay()

const urlStopNames3 = 'https://data.itsfactory.fi/journeys/api/1/journey-patterns?lineId=3'
const urlStopNames1 = 'https://data.itsfactory.fi/journeys/api/1/journey-patterns?lineId=1'

const getAllB3 =  () => {
    const request = axios.get(urlStopNames3)
    return request.then(response => response.data);
}
const getAllA3 =  () => {
    const request = axios.get(urlStopNames3)
    return request.then(response => response.data);
}
const getAllB1 =  () => {
    const request = axios.get(urlStopNames1)
    return request.then(response => response.data);
}
const getAllA1 =  () => {
    const request = axios.get(urlStopNames1)
    return request.then(response => response.data);
}

const getStop = (stopId, oneOrThree) =>{
    const stopname = stopId
    let aika=new Date(new Date().getTime()+120 *60000).toLocaleTimeString('en-GB', { timeZone: 'UTC' })
    if(oneOrThree === '3'){  
        if(day === 0){
            if( aika > "15:00:00"){
                const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=50&stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
                return request.then(response =>response.data)
            }
            else{
                const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=0&stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
                return request.then(response =>response.data)
            }
        }
        if(day !== 0){
            if( aika > "15:00:00"){
                const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=70&stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
                return request.then(response =>response.data)
            }
            else{
                const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
                return request.then(response =>response.data)
            }
        }  
    }
    if(oneOrThree ==='1'){
        if(day === 0){
            const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=0&stopPointId=${stopname}&dayTypes=${days[day]}&lineId=1`)
            return request.then(response =>response.data)  
        }
        if(day !== 0){
            if( aika > "15:00:00"){
                const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=70&stopPointId=${stopname}&dayTypes=${days[day]}&lineId=1`)
                return request.then(response =>response.data)      
            }
            else{
                const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?stopPointId=${stopname}&dayTypes=${days[day]}&lineId=1`)
                return request.then(response =>response.data)
            }
        }   
    }
}

const get ={
    getAllB3,
    getStop,
    getAllA3,
    getAllB1,
    getAllA1
}

export default get