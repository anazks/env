import React, { useEffect, useState } from 'react';
import './display.css';
import { dataRef } from '../Firebase';
import Axios from '../Axios'

function Display() {
  const [temp, setTemp] = useState(null);
  const [hum, setHum] = useState(null);
  const [voc, setVoc] = useState(null);
  const [nh3, setNh3] = useState(null);
  const [co2, setCo] = useState(null);
  const [data, setData] = useState([]);

  const [aq,setAQ] = useState('')
  useEffect(() => { 
    const fetchDataInterval = setInterval(() => {
      getDatafromDB();
      Axios.get(`air_pollution?lat=9.9647781&lon=76.2940493&appid=9221cbdf8aaa131c1efc371f8403fca0`)
        .then((response) => {
          console.log(response.data)
          setData(response.data.list[0].components)
        })
        .catch((error) => {
          console.error("Error fetching air pollution data:", error);
        });
    }, 1000);
    
    // Clear the interval when the component unmounts
    return () => clearInterval(fetchDataInterval);
   
  }, []);

  const getDatafromDB = () => {
    try {
      dataRef.ref().child('test').on('value', (data) => {
        const getData = Object.values(data.val());
        setHum(getData[0]);
        setTemp(getData[2]);
        setVoc(getData[4]);
        setCo(getData[1]);
        setNh3(getData[3]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const calculateAQI = (concentration, pollutant) => {
    // Placeholder implementation, replace with actual AQI calculation formulas
    return concentration * 10;
  };

  const getOverallAQI = () => {
    const aqiNH3 = calculateAQI(nh3, 'NH3');
    const aqiCO = calculateAQI(co2, 'CO');
    // Calculate AQI for other pollutants similarly

    // Aggregate AQI values (taking the maximum here)
    const overallAQI = Math.max(aqiNH3, aqiCO); // Adjust as per your requirements
    return overallAQI;
  };

  const interpretAQICategory = (aqi) => {
    // Placeholder interpretation logic
    if (aqi <= 50) return 'Good';
    else if (aqi <= 100) return 'Moderate';
    else return 'Unhealthy';
  };

  const handlePrediction = () => {
    const overallAQI = getOverallAQI();
    const airQuality = interpretAQICategory(overallAQI);
    console.log('Predicted Air Quality:', airQuality);
    setAQ(airQuality)
  };

  return (
    
   <>
   { aq ?<div className="aq">
       <span style={{color:'red'}}>CURRENT AIR QUALITY</span> ===><b><i>{aq}!!</i></b>
    </div> : '' }
     <div className='main'>
         
         <div className="rate">
           <div>
             <span>HUMIDITY</span>
             <h1>{hum}%</h1>
           </div>
         </div>
         <div className="temp">
           <div>
             <span> TEMPERATURE </span>
             <h1>{temp} C</h1>
           </div>
         </div>
         <div className="rate hearRate">
           <div  style={{backgroundColor:' rgb(28, 27, 27);'}}>
             <span>VOC</span> <br />
             {voc}
             <h1></h1>
           </div>
         </div>
         {
           data ? 
           <div className='bottom_row'>
             <span>NH3</span>
             <button>{data.nh3}</button>
             <span>CO</span>
             <button>{data.co}</button>
             <span>No2</span>
             <button>{data.no2}</button>
             <span>o3</span>
             <button>{data.o3}</button>
             <span>So2</span>
             <button>{data.so2}</button>
             <button onClick={handlePrediction} style={{height:'100px',backgroundColor:'green',border:'none',height:'30px'}}>Predict</button>
           </div> : null
         }
       </div>
   </>
  );
}

export default Display;
