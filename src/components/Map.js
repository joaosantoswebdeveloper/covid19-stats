import React from 'react';
import './map.css'
const { MapContainer,Popup, TileLayer, Circle } = require("react-leaflet");

export default class MapComponent extends React.Component {

render () {

    const center = (Array.isArray(this.props.center) && (this.props.center.length) ) ? 
    this.props.center :
    [38.7436057, -9.2302438]; 
    console.log("(COMPONENT MAP props:)", center, ",zoom", this.props.zoom);
            
    return (
        <MapContainer className="mapContainer" center={  center } zoom={this.props.zoom || 10 } scrollWheelZoom={false}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {this.showCirclesOnMap(this.props.countriesData, this.props.type)}
        </MapContainer>
    );
}


showCirclesOnMap(data, type="Coronavirus Cases"){

    const array_flags = ["Portugal","Spain","UK","USA"];
    return data.map( country => {
        return (
            <div className="popup__country" key={country.name}>
            {
                <Circle className="circleMap"
                center={[country.lat, country.long]}
                fillOpacity={0.4}
                color={
                    type==="Deaths" ?
                    "orange" :
                    type==="Recovered" ?
                    "lime" :
                    "#cc1034"}
                fillColor={
                    type==="Deaths" ?
                    "orange" :
                    type==="Recovered" ?
                    "lime" :
                    "rgba(204,16,52,0.5)"}
                radius={Math.sqrt(country.liveCases)*300} >
                    <Popup>
                        { array_flags.includes(country.name) &&
                            <img src={`flags/${country.name}.gif`} alt={country.name} />
                        }
                        <h2>{country.name}</h2>
                        <p>{"Cases: " + country.liveCases}</p>
                        <p>{"Recovered: " + country.recovered}</p>
                        <p>{"Deaths: " + country.deaths}</p>
                    </Popup>
                </Circle>
            }
            </div>
        );
    })
}

}
