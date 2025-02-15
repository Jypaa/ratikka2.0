import axios from 'axios'

const date = new Date();
const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday",];
let day = date.getDay()

const urlStopNames3 = '/journeys/api/1/journey-patterns?lineId=3'
const urlStopNames1 = '/journeys/api/1/journey-patterns?lineId=1'

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

    if(oneOrThree === '3'){  
        const request = axios.get(`/journeys/api/1/journeys?stopPointId=${stopname}&dayTypes=${days[day]}&lineId=3`)
        console.log('request',stopname, days[day])
        return request.then(response =>response.data)
        }
         
    
    if(oneOrThree ==='1'){
        const request = axios.get(`/journeys/api/1/journeys?stopPointId=${stopname}&dayTypes=${days[day]}&lineId=1`)
        return request.then(response =>response.data)
               
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