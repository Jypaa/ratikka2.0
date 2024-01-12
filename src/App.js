import { useState, useEffect } from 'react';
import Aikatauluservice from './services/aikataulut';
import Aikataulut from './components/Aikataulut';
import './App.css';

const App = () => {
  const [saapuminen, setSaapuminen] = useState([]);
  const [pysakitB, setPysakitB] = useState([]);
  const [pysakitA, setPysakitA] = useState([]);
  const [AB, setAB] = useState('B');
  const [stopA, setStopA] = useState('');
  const [stopB, setStopB] = useState('');
  const [selectedStop, setSelectedStop] = useState('');

  //Show it doesn't get confused to line 1
  const lineURL = "https://data.itsfactory.fi/journeys/api/1/lines/3"

  useEffect(() => {
    getPysakit();
  }, []);

  const getPysakit = async () => {
    try {
      setPysakitA([]);
      setPysakitB([]);
      const responseB = await Aikatauluservice.getAllB();
      const saapuvatB = responseB.body[0].stopPoints;
      await saapuvatB.forEach((item, index) => {
        const name = item.name;
        const shortName = item.shortName;
        setPysakitB((pysakitB) => [...pysakitB, { name, shortName ,index}]);
      });
      setStopB(responseB.body[0].stopPoints[0].shortName);
      


      const responseA = await Aikatauluservice.getAllA();
      const saapuvatA = responseA.body[0].stopPoints;

      await saapuvatA.forEach((item, index) => {
        const name = item.name;
        const shortName = item.shortName;
        setPysakitA((pysakitA) => [...pysakitA, { name, shortName, index }]);
      });
      setStopA(responseA.body[0].stopPoints[0].shortName);
      

    } catch (error) {
      console.error('Error fetching pysakit', error);
    }
  };

  useEffect(() => {
    getAikataulut();
  }, [AB,pysakitA, pysakitB, stopA, stopB]);

  const getAikataulut = async () => {
    setSaapuminen([]);
    setSaapuminen([]);
    try {
      if (AB === 'A') {
        const responseStop = await Aikatauluservice.getStop(stopA);
        const saapuvatFiltered = responseStop.body.filter((item) => item.lineUrl === lineURL);
        const saapuvat=saapuvatFiltered;
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName === stopA && saapuvat[i].lineUrl === lineURL){
              setSaapuminen((prevSaapuminen) => [...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]);
            }
          }
        }
      } else {     
        const responseStop = await Aikatauluservice.getStop(stopB);
        const saapuvatFiltered = responseStop.body.filter((item) => item.lineUrl === lineURL);
        const saapuvat=saapuvatFiltered;
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName === stopB && saapuvat[i].lineUrl === lineURL){
              setSaapuminen((prevSaapuminen) => [...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]);
            }
          }
        }
        };
      }catch (error) {
      console.error('Error fetching aikataulut', error);
    } 
  }

  const handleChange = async () => {
    await setAB((AB) => (AB === 'A' ? 'B' : 'A'));
  };

  const handleStopChange = (event) => {
    setSelectedStop(event.target.value);
    if(AB === 'B'){
      const stopB = pysakitB.find((item) => item.name === event.target.value);
      const stopShortName = stopB.shortName;
      setStopB(stopShortName);
    }
    else{
      const stopA = pysakitA.find((item) => item.name === event.target.value);
      const stopShortName = stopA.shortName;
      setStopA(stopShortName);
    }
    
  }

  if (pysakitB.length === 0 ||saapuminen.length === 0 ) {
    return <div className='container'>loading...</div>;
  }

  return (
    <div className='container'>
      <div>
        <button value={selectedStop} onClick={handleChange}>{AB === 'B' ? 'Vaihda Santalahteen' : ' Vaihda Hervantaan'}</button>
      </div>
      <div className='valinta'>
        <p>Valitse pysäkki</p>
        <select value={selectedStop} onChange={handleStopChange}>
          {AB === 'A' ? (
            pysakitA.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            pysakitB.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            ))
          )}
        </select>
      </div>
      <div className='saapuvat'>
        <h2>SAAPUVAT</h2>
        
        
      </div>
      <div className='aikataulut'>
        <h2>AIKATAULUT</h2>
        {
          saapuminen.map((saapuminen,index) => (
              <Aikataulut key={index} ajat={saapuminen}/>
          ))
        }
      </div>
    </div>
  );
};

export default App;
