import React, { Component } from 'react';
import Map from './components/Map';
import './App.css';

const places = [
  { name: "Babes Park", position: { lat: 46.764567, lng: 23.561235 }, id: "1" },
  { name: "Central Park", position: { lat: 46.7691526, lng: 23.5783746 }, id: "2" },
  { name: "Cetatuia Park", position: { lat: 46.7753634, lng: 23.581478 }, id: "3" },
  { name: "Tetarom Park", position: { lat: 46.777249, lng: 23.559200 }, id: "4" },
  { name: "Cluj Arena", position: { lat: 46.768784, lng: 23.572644 }, id: "5" },
  { name: "CFR Arena", position: { lat: 46.779516, lng: 23.577538 }, id: "6" }
]


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      clickedLocation: null
    }
  }

  onMarkerClick = (marker) => {
    //keep id of currently selected marker
    const location = places.filter(place => place.id === marker.id)[0];
    this.setState({ clickedLocation: location });

    //stop animation for all markers
    this.stopMarkersAnimation();
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
  }

  stopMarkersAnimation = () => {
    //stop all marker animation
    this.markers.forEach(marker => {
      marker.setAnimation(null);
    })
  }

  setSentMarkers = (map, markers) => {
    this.map = map;
    this.markers = markers;
  }

  render() {
    return (
      <div className="App">
        <Map locations={places} onMarkerClick={this.onMarkerClick} sendMarkers={this.setSentMarkers} onMapClick={this.stopMarkersAnimation} />
      </div>
    );
  }
}

export default App;
