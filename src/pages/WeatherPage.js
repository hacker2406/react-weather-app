import {useEffect,useState} from "react";
import WeatherRow from "../components/WeatherRow";
import WeatherSummary from "../components/WeatherSummary";
import getWeather from "../api/weatherApi";

const fetchCoordinates =(callback) =>{
    navigator.geolocation.getCurrentPosition(({coords: {latitude,longitude}})=>{
        callback(latitude, longitude);
    },
    (err) => console.error(err)
    );
};


const WeatherPage =() =>{

    const [todayWeather,setTodayWeather]=useState({});
    const [weekWeather,setWeekWeather]=useState([]);
    const [isCelsius,setIsCelsius]=useState(true);
    const isDay =todayWeather.isDay ?? true;

    useEffect(() =>{
        fetchCoordinates(async(latitude,longitude)=>{
           const weatherInfo= await getWeather({latitude,longitude});
           convertToStateVariable(weatherInfo);
        })
    },[])

    const convertToStateVariable=(tempWeekWeather)=>{
        let fetchWeatherInfo=[];
        for(let i=0;i<tempWeekWeather.daily.time.length;i++){
            fetchWeatherInfo.push({
                date: new Date(tempWeekWeather.daily.time[i]),
                maxTemperature: tempWeekWeather.daily.temperature_2m_max[i],
                minTemperature: tempWeekWeather.daily.temperature_2m_min[i],
                weatherCode: tempWeekWeather.daily.weathercode[i],
            })
        }
        setWeekWeather(fetchWeatherInfo);

        let currentWeather=tempWeekWeather.current_weather;
        currentWeather.time=new Date(currentWeather.time);
        currentWeather.isDay=currentWeather.is_day===1?true:false;
        delete currentWeather.is_day;
        currentWeather.weatherCode=currentWeather.weathercode;
        delete currentWeather.weathercode;
        setTodayWeather(currentWeather);
    }

    return (
    <div className={isDay? "app" : "app dark"}>
            <div>
            <h1 className="my-heading">Weather Page</h1>
            <button className="ui icon button"  onClick={()=>{setIsCelsius(!isCelsius)}} style={{float: "right"}}>{isCelsius? "°F": "°C" }</button>
                <div className="summary">
                    <WeatherSummary currentWeather={todayWeather} isCelsius={isCelsius} />
                    <table className={`ui very basic table${!isDay? " dark":""}`}>
                        <thead className="table-custom">
                            <tr>
                                <th className={`table-custom ${!isDay? " dark":" "}`}>Date</th>
                                <th className={`table-custom ${!isDay? " dark":" "}`}>Temperature</th>
                                <th className={`table-custom ${!isDay? " dark":" "}`}>Type</th>
                            </tr>
                        </thead>
                        <tbody className="table-custom">
                            {weekWeather.map((weather)=>(
                                <WeatherRow 
                                weather={weather}
                                isCelsius={isCelsius}
                                key={weather.date}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>  
    </div>
    );
};

export default WeatherPage;