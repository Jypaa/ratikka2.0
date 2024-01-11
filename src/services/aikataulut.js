import axios from 'axios'

const date = new Date();
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",];
let day = date.getDay() - 1

console.log("mikä päivä välillä 0-6",day)
console.log("mikä päivä on",days[day])
const Url = 'https://data.itsfactory.fi/journeys/api/1/stop-monitoring?stops=0829'
const Url2= `https://data.itsfactory.fi/journeys/api/1/journeys?stopPointId=0829&dayTypes=${days[day]}`
const Url3= `https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=70&stopPointId=0829&dayTypes=${days[day]}`
const urlStopNamesB = 'https://data.itsfactory.fi/journeys/api/1/journey-patterns/735'
const urlStopNamesA = 'https://data.itsfactory.fi/journeys/api/1/journey-patterns/760'
//Haetaan seuraavia saapuvia
const getAllB =  () => {
    const request = axios.get(urlStopNamesB)
    return request.then(response => response.data);
}
const getAllA =  () => {
    const request = axios.get(urlStopNamesA)
    return request.then(response => response.data);
}

//Koska taulu on niin iso haetaan kahdessa erässä riippuen paljon kello on
const getStop = (stopId) =>{
    const stopname = stopId
    console.log("pysäkki",stopname)
    let aika=new Date(new Date().getTime()+120 *60000).toLocaleTimeString('en-GB', { timeZone: 'UTC' })
    //console.log("paljon kello on",aika )
    //console.log( aika> "13:00:00")
    if( aika> "13:00:00"){
        const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?startIndex=70&stopPointId=${stopname}&dayTypes=${days[day]}`)
        console.log("url",request )
        return request.then(response =>response.data)
    }
    else{
        const request = axios.get(`https://data.itsfactory.fi/journeys/api/1/journeys?stopPointId=${stopname}&dayTypes=${days[day]}`)
        console.log("url",request )
        return request.then(response =>response.data)
    }
}

const get ={
    getAllB,
    getStop,
    getAllA
}

export default get