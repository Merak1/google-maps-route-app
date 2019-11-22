import React, { Component } from 'react';

import './App.css';
import MapComponent from './MapComponent';


const initialState = {
  currentLocation: {
    lat: '',
    lng: ''
  }
}
class App extends Component {

  state = {
    ...initialState
  }
  componentDidMount() {
    this.getLocation()
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  showPosition = (position) => {
    const lat = position.coords.latitude
    const long = position.coords.longitude;
    this.setState({
      currentLocation: { lat, long }
    })

  }
  render() {
    return (
      <div className="App" ref="mapContainer" >
        <MapComponent
          currentLocation={this.state.currentLocation}
        />
      </div>
    );
  }
}

export default App;
