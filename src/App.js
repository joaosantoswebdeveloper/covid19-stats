
import { Card, CardContent, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import TableComponent from './components/Table';
import './index.css';
import React from 'react';
import GraphPlot from './components/utilsChart';
import "leaflet/dist/leaflet.css";
import './components/map.css';


function App() {
  const [countries, setCountries] = useState([]);
  let [countrySelected, setCountrySelected] = useState("Worldwide");
  let [countryData, setCountryData] = useState([]);
  const [getHistoricalData, setHistoricalData] = useState([]);
  const [getMapCenter, setMapCenter] = useState([38.7436057, -9.2302438]);//38.7436057, -9.2302438
  const [getMapZoom, setMapZoom] = useState(2);
  const [getSelectedOption, setSelectedOption] = useState("Coronavirus Cases");
  
  //fetch all countries data
  useEffect( () => {

    const fetchData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then( response => response.json())
      .then( data => {
        
        const countriesData = data.map( country => {
          return {
            name: country.country,
            value: country.countryInfo.iso2,
            liveCases: country.cases,
            recovered: country.recovered,
            deaths: country.deaths,
            lat: country.countryInfo.lat,
            long: country.countryInfo.long,
          }
        });
        setCountries(countriesData);
      });
    };
    fetchData();

  }, []);



  //fetch all countries historical data
  useEffect( ()=>{

    const getHistorical = async() => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then(response => response.json())
      .then(data => {
          console.log("getHistorical", data);
          /*
          getHistorical {cases: {…}, deaths: {…}, recovered: {…}} 
          cases: {11/27/20: 61645535, 11/28/20: 62244181, 11/29/20: 62730726, 11/30/20: 63236804, 12/1/20: 63839023}
          */

          //translate historiacal data from api to chart data:
          const casesObj = data.cases;
          //console.log("casesObj", casesObj);
          
          const cleanData = (Object.entries(casesObj)).map( element => {
            if( (element[0]==='') || (element[1]==='') ) {
              return [];
            }

            //const monthDate = element[0].indexOf("/");
            

            //console.log("element 0", element[0] + ",element 1", element[1]);
            return element;
          });
          //console.log("cleanData", cleanData);
          //translate historiacal data from api to chart data.

          setHistoricalData(cleanData);

      });
    };
    
    getHistorical();

  }, []);


  
  //change country selected on dropdown and update infoboxs data
  useEffect( () => {
    //countrySelected Worldwide or another
    const apiUrl = (countrySelected === "Worldwide") ?
     "https://disease.sh/v3/covid-19/all" :
     `https://disease.sh/v3/covid-19/countries/${countrySelected}`;
     
    console.log("countrySelected",countrySelected);
    //console.log("apiUrl",apiUrl);

    const getCountryData = async() => {
        await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          console.log("getCountryData", data);
          setCountryData(data);


          //re-center map
          console.log("re-center map", countrySelected);
          if(countrySelected === "Worldwide"){
            setMapCenter([38.7436057, -9.2302438]);
            setMapZoom(2);

          }
          else{
            setMapCenter([data.countryInfo.lat, data.countryInfo.long] );
            setMapZoom(4);
          }
          //re-center map

        });
    }
    getCountryData();


  }, [countrySelected]);
  


  const handleChange = (e) =>{
    setCountrySelected(e.target.value);
  }

  const {todayCases, todayDeaths, todayRecovered, cases, deaths, recovered } = countryData;
  return (
    <div className="app">
      <div className="app__left">

        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__countrie">
            <Select className="app__selectCountrie" variant="outlined" value={ countrySelected } onChange={ handleChange } >
            <MenuItem key={"-1"} value="Worldwide">Worldwide</MenuItem>
              {
              countries.map((country, index) => {
                return (
                  <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
                );
              })
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" today={todayCases} total={cases} type={getSelectedOption} onClick={ e=>setSelectedOption("Coronavirus Cases") } />
          <InfoBox title="Recovered" today={todayRecovered} total={recovered} type={getSelectedOption} onClick={ e=>setSelectedOption("Recovered") } />
          <InfoBox title="Deaths" today={todayDeaths} total={deaths} type={getSelectedOption} onClick={ e=>setSelectedOption("Deaths") } />
        </div>
        <Map key={"mapkey"+getMapCenter[0] + "-" + getMapZoom + "-" + getSelectedOption}
          center={getMapCenter}
          zoom={getMapZoom}
          countriesData={countries}
          type={getSelectedOption}
        />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <Typography component="h3">Live cases by Country</Typography>
            <TableComponent countries={countries} />

            <div className="app_graph">              
              <Typography component="h3">Worldwide new cases</Typography>
              {
              Array.isArray(getHistoricalData)&&(getHistoricalData.length) &&
              <GraphPlot data={getHistoricalData}/>
              }
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;