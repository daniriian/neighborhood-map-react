import React, { Component } from 'react';
import Map from './components/Map';
import PlaceList from './components/PlaceList';
import './App.css';

const places = [
  { name: "Babes Park", position: { lat: 46.764567, lng: 23.561235 }, id: "1" },
  { name: "Central Park", position: { lat: 46.7691526, lng: 23.5783746 }, id: "2" },
  { name: "Cetatuia Park", position: { lat: 46.7753634, lng: 23.581478 }, id: "3" },
  { name: "Tetarom Park", position: { lat: 46.777249, lng: 23.559200 }, id: "4" },
  { name: "Cluj Arena", position: { lat: 46.768784, lng: 23.572644 }, id: "5" },
  { name: "CFR Arena", position: { lat: 46.779516, lng: 23.577538 }, id: "6" }
]

const client_id = "IDVQQW1QV53UQ54QCLNFV5VZZV445EU1SQAASL0OP5KSUPGL";
const client_secret = "SQ5A1ZPSZKWAETXUEI1UAUOGW2U2ZMUXYCXVAX3SGMRTZRYH";


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      places: places,
      clickedLocation: null,
      info: null
    }
  }

  componentDidMount() {
    // let locations = places.map(place => {
    //   return {
    //     name: place.name,
    //     position: place.position,
    //     id: place.id,
    //     info: null,
    //     // active: false
    //   }
    // })
    // this.setState({ places: locations })
  }

  onMarkerClick = (marker) => {
    const location = this.state.places.filter(place => place.id === marker.id)[0];

    if (marker.getAnimation()) {
      marker.setAnimation(null);
      this.infoWindow.close();
      this.setState({
        clickedLocation: null,
        info: null
      })
    }
    else {
      this.stopMarkersAnimation();
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      this.setState({
        clickedLocation: location,
        info: null
      })

      this.getFSData(marker, this.infoWindow);//fetch data from Foursquare API

      if (this.state.info === null) {
        this.infoWindow.setContent(`<h3>Loading data for  ${this.state.clickedLocation.name} ...</h3><h3>Please wait</h3>`);
        this.infoWindow.open(this.map, marker);

      }
      else if (this.state.info === -1) {
        this.infoWindow.setContent(`<h3>Error loading data for ${this.state.clickedLocation.name} ...</h3>`);
        this.infoWindow.open(this.map, marker);
      }
      // else {
      //   this.infoWindow.setContent(`<div>${this.state.info}</div>
      //   <h6>Source: <a href="https://developer.foursquare.com/">Foursquare</a></h6>`);
      // }
    }
  }

  getFSData = (marker, infowindow) => {

    let url = "https://api.foursquare.com/v2/venues/search?client_id=" + client_id + "&client_secret=" + client_secret + "&v=20180710&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

    fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {

        let innerHtml = '';
        innerHtml = `<div>`

        let location_data = data.response.venues[0];
        let name = location_data.name;
        let city = location_data.location.city;
        let address = location_data.location.address;
        let readMore = `https://foursquare.com/v/${location_data.id}`;


        innerHtml += `<h1>${name}</h1>`
        innerHtml += `<h4>${city}</h1>`
        innerHtml += `<h4>${address}</h1>`
        innerHtml += `<a href=${readMore} target="_blank">Read more...</a></a>`
        innerHtml += `<h5>Source: <a href="https://developer.foursquare.com/">Foursquare</a></h5></div>`

        console.log(innerHtml)
        this.setState({ info: innerHtml })
        infowindow.setContent(this.state.info);
        console.log('from getFSData', this.state.info)
      })
      .catch(err => {
        console.log(err);
        this.setState({ info: `<p>Error loading Foursquare API. Please try again later</p>` });
        infowindow.setContent(this.state.info);
      });
    console.log('from getFSData ultimul', this.state.info)
  }

  stopMarkersAnimation = () => {
    //stop all marker animation
    this.markers.forEach(marker => {
      marker.setAnimation(null);
      this.setState({ clickedLocation: null })
    })
  }

  setSentMarkers = (map, markers) => {
    this.map = map;
    this.markers = markers;
    this.infoWindow = new window.google.maps.InfoWindow();
  }

  filterMarkers = (filtered) => {
    // Nothing to filter ?
    if (filtered == null) {
      // Show all markers
      this.markers.forEach(marker => { marker.setVisible(true) });
    }
    else if (filtered.length > 0) {
      // Hide all markers
      this.markers.forEach(marker => { marker.setVisible(false) });
      // Show the corresponding marker
      this.markers.filter(marker => marker.id === filtered[0].id)[0].setVisible(true);
      // If there is no result after filteration
    } else {
      this.markers.forEach(marker => { marker.setVisible(false) });
    }

  }


  locationClick = () => {

  }

  render() {
    return (
      <div className="App">
        <PlaceList location_list={this.state.places}
          filter={this.filterMarkers}
          locationClick={this.locationClick}
        />
        <Map locations={places}
          onMarkerClick={this.onMarkerClick}
          sendMarkers={this.setSentMarkers}
          onMapClick={this.stopMarkersAnimation}
        />
      </div>
    );
  }
}

export default App;
