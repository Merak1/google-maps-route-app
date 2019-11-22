import React, { Component } from 'react';

const stateInicial = {
  map: {
    map: {},
  },
  mapIsRendered: false,
  direcciones: {
    direccionInicial: {
      lat: 0,
      lng: 0
    },
    direccionFinal: {
      lat: 0,
      lng: 0
    }
  },
  menuSearchDisplay: false
}
const google = window.google
const directionsRenderer = new google.maps.DirectionsRenderer();
const directionsService = new google.maps.DirectionsService();

class MapComponent extends Component {

  state = { ...stateInicial }

  componentDidMount() {
    this.googleChecker();
  }
  googleChecker = () => {
    if (!window.google) {
      setTimeout(this.googleChecker, 100);
      console.log("not there yet");
    } else {
      console.log("we're good to go!!");
      this.initMap();
      this.setState({ mapIsRendered: true })
    }
  }
  getRoute = (direcciones) => {
    if (this.state.direcciones.length === 0) {
      console.log("no hay")
    }
    this.calculateAndDisplayRoute(direcciones, directionsService, directionsRenderer)
    const div = this.refs.Search
    div.classList.add("dismiss");
    div.classList.remove("selected");
    this.setState({ menuSearchDisplay: false })
  }

  initMap = () => {
    const cords = { lat: 19.4326077, lng: -99.13320799999997 };
    const Map = new google.maps.Map(this.refs.mapContainer, {
      zoom: 8,
      center: {
        lat: cords.lat,
        lng: cords.lng
      }
    })
    directionsRenderer.setMap(Map);
    this.setState({ map: Map })
  }

  handleChange = e => {
    this.setState({
      direcciones: {
        ...this.state.direcciones,
        [e.target.name]: {
          nombre: e.target.value
        }
      }
    })
    this.initAutocomplete(e.target.name)
  }
  initAutocomplete = (name) => {
    name === 'direccionInicial' ? this.autocompleteDeparture() : this.autocompleteDestination()
  }


  autocompleteDeparture(e) {
    const input = this.refs.direccionInicial
    const autocompleteDestination = new google.maps.places.Autocomplete(input, { types: ['address'] })
    autocompleteDestination.setFields(['geometry']);
    autocompleteDestination.addListener('place_changed', () => {
      const place = autocompleteDestination.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      this.setState({
        direcciones: {
          ...this.state.direcciones,
          direccionInicial: {
            lat: lat,
            lng: lng
          }
        }
      })
    });
  }
  autocompleteDestination(e) {
    const input = this.refs.direccionFinal
    const autocompleteDestination = new google.maps.places.Autocomplete(input, { types: ['address'] })
    autocompleteDestination.setFields(['geometry']);
    autocompleteDestination.addListener('place_changed', () => {
      const place = autocompleteDestination.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      this.setState({
        direcciones: {
          ...this.state.direcciones,
          direccionFinal: {
            lat: lat,
            lng: lng
          }
        }
      })
    });
  }
  calculateAndDisplayRoute = (direcciones, directionsService, directionsRenderer) => {
    const start = new google.maps.LatLng(direcciones.direccionInicial);
    const end = new google.maps.LatLng(direcciones.direccionFinal);
    const request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };
    directionsService.route(request,
      (result, status) => {
        if (status === 'OK') {
          console.log("result", result)
          directionsRenderer.setDirections(result);
        }
      });
  }
  showMenu = () => {
    const div = this.refs.Search

    if (this.state.menuSearchDisplay === false) {
      div.classList.add("dismiss");
      div.classList.remove("selected");
      this.setState({ menuSearchDisplay: true })
    } else {
      div.classList.add("selected");
      div.classList.remove("dismiss");
      this.setState({ menuSearchDisplay: false })

    }
  }
  render() {
    return (

      <React.Fragment>

        <div className=" map-holder" >
          <div id="map" ref="mapContainer" />
        </div>
        <div className="container">

          <div className="Search " ref="Search">
            <div className="Search-inputs">
              <button onClick={this.showMenu} className="get-search-menu"> > </button>
              <input
                onChange={this.handleChange}
                name="direccionInicial"
                autoComplete="off"
                placeholder="¿En dónde te recogemos?"
                ref="direccionInicial" type="text"
              />
              <input
                onChange={this.handleChange}
                name="direccionFinal"
                autoComplete="off"
                placeholder="¿A dónde vámos?"
                ref="direccionFinal" type="text"
              />
              <input
                type="submit"
                className=" button btn"
                value="Buscar Ruta"
                onClick={() => this.getRoute(this.state.direcciones)}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default MapComponent