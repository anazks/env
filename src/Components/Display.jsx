import React, { useEffect, useState } from 'react';
import './display.css';
import { dataRef } from '../Firebase';
import Axios from '../Axios'
import AxiosNew from '../Axios2'
function Display() {
  const [temp, setTemp] = useState(null);
  const [hum, setHum] = useState(null);
  const [voc, setVoc] = useState(null);
  const [nh3, setNh3] = useState(null);
  const [co2, setCo] = useState(null);
  const [data, setData] = useState([]);
  const [prediction,setPrediction] = useState(0)
  const [Co2,setCo2] = useState(0)
  const [co2Alert,setCo2Alert] = useState(false)
  const [aq,setAQ] = useState('')
  
  useEffect(() => {
  
    getDatafromDB();
    const fetchDataInterval = setInterval(() => {
      getDatafromDB();
    
      Axios.get(`air_pollution?lat=9.9647781&lon=76.2940493&appid=9221cbdf8aaa131c1efc371f8403fca0`)
        .then((response) => {
          console.log(response.data,"air")
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
      dataRef.ref().child('test').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const getData = Object.values(data);
          console.log(getData, "getData...");
          setHum(getData[0]);
          setTemp(getData[2]);
          setVoc(getData[4]);
          setCo2(getData[4] / 10);
          setCo(getData[1]);
          setNh3(getData[3]);
          //demo data to change C02 value change
          if (Co2 > 0.3) {
            console.log("alert");
            setCo2Alert(true);
          } else {
            console.log(" no alert");
            setCo2Alert(false);
          }
        } else {
          console.log("No data available in the database.");
        }
      });
    } catch (error) {
      console.log("Error fetching data from Firebase:", error);
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
  const interpretAQICategorys = (aqi) => {
    if (aqi <= 50) return 'Good';
    else if (aqi <= 100) return 'Fair';
    else if (aqi <= 200) return 'Moderate';
    else if (aqi <= 300) return 'Poor';
    else if (aqi <= 400) return 'Very Poor';
    else return 'Severe';
  };
  const handlePredictionDetails = () => {
    Axios.get('/air_pollution?lat=9.9647781&lon=76.2940493&appid=9221cbdf8aaa131c1efc371f8403fca0')
      .then((response) => {  
        if (response && response.data) {
          const aqi = response.data.list[0].main.aqi;
          const predictedAirQuality = interpretAQICategorys(aqi);
          console.log('Predicted Air Quality:', predictedAirQuality);
          setPrediction(predictedAirQuality);
        } else {
          console.error("Invalid response received.");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response received:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error in request:", error.message);
        }
      });
  };
  return (
    
   <>
  <>
  {aq ? (
    <div className="aq">
      <span style={{ color: 'red' }}>CURRENT AIR QUALITY</span> <b><i>{aq}!!</i></b>
    </div>
  ) : null}
{
  prediction ? (
    <div className="prediction">
      <span style={{ color: 'red' }}>PREDICTED AIR QUALITY</span> <b><i>{prediction}</i></b>
    </div>
  ) : null
}
</>\
<>
    {
        co2Alert ?
      <div className='alert'>
        <h2>High Gas Level Detected!!</h2>
    </div> : ""
    }
</>

     <div className='main'>
         
         <div className="rate">
           <div>
             <span>HUMIDITY</span>
             <h1>{hum + 30}%</h1>
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
             <span>CO2</span>
             <button>{Co2.toFixed(2)}</button>
             <button onClick={handlePrediction} style={{height:'100px',backgroundColor:'green',border:'none',height:'30px',color:'white'}}>Check Now</button>
             <button onClick={handlePredictionDetails} style={{height:'100px',backgroundColor:'yellow',border:'none',height:'30px'}}>Predict</button>

           </div> : null
         }
       </div>
   </>
  );
}

export default Display;
