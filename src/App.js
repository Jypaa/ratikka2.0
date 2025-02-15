import { useState, useEffect } from 'react';
import Aikatauluservice from './services/aikataulut';
import Aikataulut from './components/Aikataulut';
import './App.css';

const App = () => {
  const [saapuminen, setSaapuminen] = useState([]);
  const [pysakitB3, setPysakitB3] = useState([]);
  const [pysakitA3, setPysakitA3] = useState([]);
  const [pysakitB1, setPysakitB1] = useState([]);
  const [pysakitA1, setPysakitA1] = useState([]);
  const [AB3, setAB3] = useState('A');
  const [AB1, setAB1] = useState('B');
  const [stopA3, setStopA3] = useState('');
  const [stopB3, setStopB3] = useState('');
  const [stopA1, setStopA1] = useState('');
  const [stopB1, setStopB1] = useState('');
  const [oneOrThree, setOneOrThree ] = useState('3');
  const [tila, setTila] = useState('');
  const [selectedStop, setSelectedStop] = useState('');

  useEffect(() => {
    setSaapuminen([]);
    getPysakit();
    
  }, []);

  const getPysakit = async () => {
    try {
      setPysakitA3([]);
      setPysakitB3([]);
      setPysakitA1([]);
      setPysakitB1([]);
  
      const [responseB3, responseA3, responseB1, responseA1] = await Promise.all([
        Aikatauluservice.getAllB3(),
        Aikatauluservice.getAllA3(),
        Aikatauluservice.getAllB1(),
        Aikatauluservice.getAllA1()
      ]);
  
      const saapuvatB3 = responseB3.body[3].stopPoints;
      const saapuvatA3 = responseA3.body[2].stopPoints;
      const saapuvatB1 = responseB1.body[2].stopPoints;
      const saapuvatA1 = responseA1.body[3].stopPoints;
  
      setPysakitB3(saapuvatB3.map((item, index) => ({ name: item.name, shortName: item.shortName, index })));
      setStopB3(saapuvatB3[0].shortName);
  
      setPysakitA3(saapuvatA3.map((item, index) => ({ name: item.name, shortName: item.shortName, index })));
      setStopA3(saapuvatA3[0].shortName);
  
      setPysakitB1(saapuvatB1.map((item, index) => ({ name: item.name, shortName: item.shortName, index })));
      setStopB1(saapuvatB1[0].shortName);
  
      setPysakitA1(saapuvatA1.map((item, index) => ({ name: item.name, shortName: item.shortName, index })));
      setStopA1(saapuvatA1[0].shortName);
  
      console.log('responseB3', responseB3);
      console.log('responseA3', responseA3);
      console.log('responseB1', responseB1);
      console.log('responseA1', responseA1);
    } catch (error) {
      console.error('Error fetching pysakit', error);
    }
  };

  useEffect(() => {

    getAikataulut();
    const intervalId = setInterval(() => {

      getAikataulut();
      setTila('');
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [AB3,pysakitA3, pysakitB3, stopA3, stopB3, oneOrThree, AB1, pysakitA1, pysakitB1, stopA1, stopB1]);

  const getAikataulut = async () => {
    setSaapuminen([]);

    try{
    if(oneOrThree === '3'){
      console.log('AB3', AB3)
      if (AB3 === 'A') {
        const responseStop = await Aikatauluservice.getStop(stopA3, oneOrThree);
        if(responseStop.status === "error"){

          return(
            setTila('error')
          )
        }
        const saapuvat=responseStop.body
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName === stopA3 ){
              setSaapuminen((prevSaapuminen) => ([...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]).sort());
            }
          }
        }
      }
      if (AB3 === 'B') {
        console.log('stopB3', stopB3)
        const responseStop = await Aikatauluservice.getStop(stopB3, oneOrThree);
        console.log('responseStop',responseStop)
        if(responseStop.status === "error"){
          return(
            setTila('error')
          )
        }
        const saapuvat=responseStop.body
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName === stopB3 ){
              setSaapuminen((prevSaapuminen) => ([...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]).sort());
            }
          }
        }   
      }
    }


    if(oneOrThree === '1'){
      console.log('AB1', AB1)
      if (AB1 === 'A') {
        const responseStop = await Aikatauluservice.getStop(stopA1, oneOrThree);
        if(responseStop.status === "error"){
          return(
            setTila('error')
          )
        }
        const saapuvat=responseStop.body
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName === stopA1 ){
              setSaapuminen((prevSaapuminen) => ([...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]).sort());
            }
          }
        }

      }
      if (AB1 === 'B') {
        const responseStop = await Aikatauluservice.getStop(stopB1, oneOrThree);
        if(responseStop.status === "error"){
          return(
            setTila('error')
          )
        }
        const saapuvat=responseStop.body
        for(let i = 0; i < saapuvat.length; i++){
          for(let j = 0; j < saapuvat[i].calls.length; j++){
            if(saapuvat[i].calls[j].stopPoint.shortName === stopB1 ){
              setSaapuminen((prevSaapuminen) => ([...prevSaapuminen, saapuvat[i].calls[j].arrivalTime]).sort());
            }
          }
        }
      }
    }



  }catch(error){
    console.error('Error fetching aikataulut', error);
  };
}
  const handleLineChange = async () => {
    await setOneOrThree((oneOrThree) => (oneOrThree === '1' ? '3' : '1'));
  }

  const handleChange = async () => {
    if(oneOrThree === '3'){
      await setAB3((AB3) => (AB3 === 'A' ? 'B' : 'A'));
    }
    else{
      await setAB1((AB1) => (AB1 === 'A' ? 'B' : 'A'));
    }

  };

  const handleStopChange = (event) => {
    setSelectedStop(event.target.value);
    if(AB3 === 'B' && oneOrThree === '3'){
      const stopB3 = pysakitB3.find((item) => item.name === event.target.value);
      const stopShortName = stopB3.shortName;
      setStopB3(stopShortName);
    }
    if(AB3 === 'A' && oneOrThree === '3'){
      const stopA3 = pysakitA3.find((item) => item.name === event.target.value);
      const stopShortName = stopA3.shortName;
      setStopA3(stopShortName);
    }
    if(AB1 === 'B' && oneOrThree === '1'){
      const stopB1 = pysakitB1.find((item) => item.name === event.target.value);
      const stopShortName = stopB1.shortName;
      setStopB1(stopShortName);
    }
    if(AB1 === 'A' && oneOrThree === '1'){
      const stopA1 = pysakitA1.find((item) => item.name === event.target.value);
      const stopShortName = stopA1.shortName;
      setStopA1(stopShortName);
    }
    
  }


  if ((saapuminen.length === 0 && pysakitA3.length === 0 && pysakitB3.length === 0) || (saapuminen=== 0 && pysakitA1.length === 0 && pysakitB1.length === 0) ) {
    if(tila === 'error'){
      return <div className='container'>ERROR fetching data, please come back later</div>;
    }
    else{
      return <div className='container'>loading...</div>;
    }
    
  }

  if(oneOrThree === '1'){
    return (
      <div className='container'>
        <div className='buttons'>
          <button className='button' value={selectedStop} onClick={handleLineChange}><span>{oneOrThree === '1' ? 'Vaihda 3' : 'Vaihda 1'}</span></button>
          <button className='button' value={selectedStop} onClick={handleChange}><span>{AB1 === 'B' ? 'Vaihda Taysiin' : 'Vaihda Santalahteen'}</span></button>
        </div>
        <div className='tiedot'>
          <h5>Linjan {oneOrThree} aikataulut, suuntaan {AB1 === 'A' ? 'Santalahti' : 'Tays'}</h5>
        </div>
        <div className='valinta'>
        <h3>Valitse pysäkki</h3>
        <select className='selector' value={selectedStop} onChange={handleStopChange}>
            {AB1 === 'A' ? (
              pysakitA1.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))
            ) : (
             pysakitB1.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))
            )}
          </select>
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
  }
  if(oneOrThree === '3'){
    return (
      <div className='container'>
        <div className='buttons'>
          <button className='button' value={selectedStop} onClick={handleLineChange}><span>{oneOrThree === '1' ? 'Vaihda 3' : 'Vaihda 1'}</span></button>
          <button className='button' value={selectedStop} onClick={handleChange}><span>{AB3 === 'B' ? 'Vaihda Hervantaan' : 'Vaihda Sorin aukiolle'}</span></button>
        </div>
        <div className='tiedot'>
          <h5>Linjan {oneOrThree} aikataulut, suuntaan {AB3 === 'A' ? 'Sorin Aukio' : 'Hervanta'}</h5>
        </div>
        <div className='valinta'>
        <h3>Valitse pysäkki</h3>
        <select className='selector' value={selectedStop} onChange={handleStopChange}>
            {AB3 === 'A' ? (
              pysakitA3.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))
            ) : (
             pysakitB3.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))
            )}
          </select>
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
  }
};

export default App;
