import axios from 'axios'

const date = new Date();
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",];
let day = date.getDay() - 1

const urlStopNamesB = 'https://data.itsfactory.fi/journeys/api/1/journey-patterns/735'
const urlStopNamesA = 'https://data.itsfactory.fi/journeys/api/1/journey-patterns/760'

const getAllB =  () => {
    const request = axios.get(urlStopNamesB)
    return request.then(response => response.data);
}
const getAllA =  () => {
    const request = axios.get(urlStopNamesA)
    return request.then(response => response.data);
}

const getStop = (stopId) =>{
    const stopname = stopId
    let aika=new Date(new Date().getTime()+120 *60000).toLocaleTimeString('en-GB', { timeZone: 'UTC' })
    if( aika > "13:00:00"){
        const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=70&stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
        return request.then(response =>response.data)
    }
    else{
        const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
        return request.then(response =>response.data)
    }
}

const get ={
    getAllB,
    getStop,
    getAllA
}

export default get