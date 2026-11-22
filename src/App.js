import { useState, useEffect, useCallback } from 'react';
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
      setSelectedStop(saapuvatA3[0].name);

  
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

  const getAikataulut = useCallback(async () => {
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
  }, [AB1, AB3, oneOrThree, stopA1, stopA3, stopB1, stopB3]);

  useEffect(() => {
    getAikataulut();
    const intervalId = setInterval(() => {
      getAikataulut();
      setTila('');
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [getAikataulut]);

  const handleLineChange = async () => {
    await setOneOrThree((currentLine) => {
      const nextLine = currentLine === '1' ? '3' : '1';
      const nextStops = nextLine === '3'
        ? (AB3 === 'A' ? pysakitA3 : pysakitB3)
        : (AB1 === 'A' ? pysakitA1 : pysakitB1);
      if (nextStops.length > 0) {
        setSelectedStop(nextStops[0].name);
        if (nextLine === '3') {
          if (AB3 === 'A') setStopA3(nextStops[0].shortName);
          else setStopB3(nextStops[0].shortName);
        } else {
          if (AB1 === 'A') setStopA1(nextStops[0].shortName);
          else setStopB1(nextStops[0].shortName);
        }
      }
      return nextLine;
    });
  }

  const handleChange = async () => {
    if(oneOrThree === '3'){
      await setAB3((currentDirection) => {
        const nextDirection = currentDirection === 'A' ? 'B' : 'A';
        const nextStops = nextDirection === 'A' ? pysakitA3 : pysakitB3;
        if (nextStops.length > 0) {
          setSelectedStop(nextStops[0].name);
          if (nextDirection === 'A') setStopA3(nextStops[0].shortName);
          else setStopB3(nextStops[0].shortName);
        }
        return nextDirection;
      });
    }
    else{
      await setAB1((currentDirection) => {
        const nextDirection = currentDirection === 'A' ? 'B' : 'A';
        const nextStops = nextDirection === 'A' ? pysakitA1 : pysakitB1;
        if (nextStops.length > 0) {
          setSelectedStop(nextStops[0].name);
          if (nextDirection === 'A') setStopA1(nextStops[0].shortName);
          else setStopB1(nextStops[0].shortName);
        }
        return nextDirection;
      });
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

  const isLineThree = oneOrThree === '3';
  const stops = isLineThree
    ? (AB3 === 'A' ? pysakitA3 : pysakitB3)
    : (AB1 === 'A' ? pysakitA1 : pysakitB1);
  const destination = isLineThree
    ? (AB3 === 'A' ? 'Sorin aukio' : 'Hervanta')
    : (AB1 === 'A' ? 'Santalahti' : 'Tays');
  const isLoading = stops.length === 0;

  return (
    <main className="app-shell">
      <section className="schedule-card" aria-live="polite">
        <header className="schedule-header">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              <span>{oneOrThree}</span>
            </div>
            <div>
              <p className="eyebrow">Tampereen ratikka</p>
              <h1>Linja {oneOrThree}</h1>
            </div>
          </div>
          <div className="line-switch" aria-label="Valitse linja">
            <button
              type="button"
              className={oneOrThree === '1' ? 'line-button active' : 'line-button'}
              onClick={() => oneOrThree !== '1' && handleLineChange()}
            >
              1
            </button>
            <button
              type="button"
              className={oneOrThree === '3' ? 'line-button active' : 'line-button'}
              onClick={() => oneOrThree !== '3' && handleLineChange()}
            >
              3
            </button>
          </div>
        </header>

        <div className="route-panel">
          <div className="route-copy">
            <span>Suunta</span>
            <strong>{destination}</strong>
          </div>
          <button type="button" className="direction-button" onClick={handleChange}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" />
            </svg>
            Vaihda suuntaa
          </button>
        </div>

        <div className="stop-picker">
          <label htmlFor="stop-select">Pysäkki</label>
          <div className="select-wrap">
            <select
              id="stop-select"
              className="stop-select"
              value={selectedStop}
              onChange={handleStopChange}
              disabled={isLoading}
            >
              {stops.map((item) => (
                <option key={item.shortName} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </div>
        </div>

        <section className="departures">
          <div className="departures-heading">
            <div>
              <p className="eyebrow">Seuraavat</p>
              <h2>Saapumisajat</h2>
            </div>
            <span className="live-badge"><i /> Päivitetään 5 min välein</span>
          </div>

          {tila === 'error' ? (
            <div className="state-message error-message">
              <strong>Aikatauluja ei juuri nyt saada</strong>
              <span>Yritä hetken kuluttua uudelleen.</span>
            </div>
          ) : isLoading ? (
            <div className="state-message">
              <span className="spinner" />
              <strong>Ladataan pysäkkejä</strong>
            </div>
          ) : saapuminen.length === 0 ? (
            <div className="state-message">
              <strong>Ei tulevia vuoroja</strong>
              <span>Valitse toinen pysäkki tai suunta.</span>
            </div>
          ) : (
            <div className="departure-list">
              {saapuminen.map((arrival, index) => (
                <Aikataulut key={`${arrival}-${index}`} ajat={arrival} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default App;
