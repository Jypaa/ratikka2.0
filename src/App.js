import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Aikatauluservice from './services/aikataulut';
import Aikataulut from './components/Aikataulut';
import { set } from 'mongoose';


const App = () => {
  const [saapuminen, setSaapuminen] = useState([]);
  const [pysakitB, setPysakitB] = useState([]);
  const [pysakitA, setPysakitA] = useState([]);
  const [AB, setAB] = useState('B');
  const [stop, setStop] = useState('');
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
      console.log('onnistuiko pysakit B', responseB.body[0].stopPoints);
      const saapuvatB = responseB.body[0].stopPoints;
      console.log('saapuvatB', saapuvatB);
      await saapuvatB.forEach((item, index) => {
        const name = item.name;
        const shortName = item.shortName;
        setPysakitB((pysakitB) => [...pysakitB, { name, shortName ,index}]);
      });
      console.log('pysakitB', responseB.body[0].stopPoints[0].shortName);
      setStop(responseB.body[0].stopPoints[0].shortName);


      const responseA = await Aikatauluservice.getAllA();
      console.log('onnistuiko pysakit A', responseA.body[0].stopPoints);
      const saapuvatA = responseA.body[0].stopPoints;

      saapuvatA.forEach((item) => {
        const name = item.name;
        const shortName = item.shortName;
        setPysakitA((pysakitA) => [...pysakitA, { name, shortName }]);
      });
      setStop(responseB.body[0].stopPoints[0].shortName);

    } catch (error) {
      console.error('Error fetching pysakit', error);
    }
  };

  useEffect(() => {
    getAikataulut();
  }, [AB, pysakitA, pysakitB,stop]);

  const getAikataulut = async () => {
    setSaapuminen([]);
    setSaapuminen([]);
    try {
      const direction = AB;
      if (direction === 'A') {
        console.log('suunta A', pysakitA);
        
        const responseStop = await Aikatauluservice.getStop(stop);
        console.log('onnistuiko aikataulu', responseStop.body);
        const saapuvat = responseStop.body;
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName == stop && saapuvat[i].lineUrl == lineURL){
              setSaapuminen((prevSaapuminen) => [...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]);
            }
          }
        }
        console.log('saapuminenA', saapuminen);
      } else {     
        console.log('suunta B', pysakitB);
        console.log('suunta B', stop);
        const responseStop = await Aikatauluservice.getStop(stop);
        console.log('onnistuiko aikataulu', responseStop.body);
        const saapuvat = responseStop.body;
        console.log('stop', stop)
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName == stop && saapuvat[i].lineUrl == lineURL){
              setSaapuminen((prevSaapuminen) => [...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]);
            }
          }
        }
        console.log('saapuminenB', saapuminen);
        };
      }catch (error) {
      console.error('Error fetching aikataulut', error);
    } 
    }

  const handleChange = () => {
    console.log('AB', AB);
    setAB((AB) => (AB === 'A' ? 'B' : 'A'));
    console.log('AB', AB);
    setSaapuminen([]);
  };

  if (pysakitB.length === 0 ||saapuminen.length === 0 ) {
    return <div>loading...</div>;
  }

  const handleStopChange = (event) => {
    console.log('event', event.target.value);
    setSelectedStop(event.target.value);
    if(AB === 'B'){
      const stop = pysakitB.find((item) => item.name === event.target.value);
      console.log('valittu pysäkki', stop);
      const stopShortName = stop.shortName;
      console.log('valittu pysäkki', stopShortName);
      setStop(stopShortName);
    }
    else{
      const stop = pysakitA.find((item) => item.name === event.target.value);
      console.log('valittu pysäkki', stop);
      const stopShortName = stop.shortName;
      console.log('valittu pysäkki', stopShortName);
      setStop(stopShortName);
    }
    
  }
  return (
    <div>
      <div>
        <button onClick={handleChange}>Vaihda A/B</button>
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
        {
          saapuminen.map((saapuminen,index) => (
              <Aikataulut key={index}ajat={(saapuminen)}/>
          ))
        }
        
      </div>
      <div className='pysakit'>
        <h2>AIKATAULUT</h2>
      </div>
    </div>
  );
};

export default App;
