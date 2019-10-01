import React, { Component } from 'react';
import Map from './components/map/Map';
import PlaceList from './components/placeList/PlaceList';
import './App.css';

const places = [
  { name: 'Babes Park', position: { lat: 46.764567, lng: 23.561235 }, id: '1' },
  {
    name: 'Central Park',
    position: { lat: 46.7691526, lng: 23.5783746 },
    id: '2'
  },
  {
    name: 'Cetatuia Park',
    position: { lat: 46.7753634, lng: 23.581478 },
    id: '3'
  },
  { name: 'Tetarom Park', position: { lat: 46.777249, lng: 23.5592 }, id: '4' },
  { name: 'Cluj Arena', position: { lat: 46.768784, lng: 23.572644 }, id: '5' },
  { name: 'CFR Arena', position: { lat: 46.779516, lng: 23.577538 }, id: '6' }
];

const client_id = `${process.env.REACT_APP_FSQ_CLIENT_ID}`;
const client_secret = `${process.env.REACT_APP_FSQ_CLIENT_SECRET}`;
let info = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: places,
      placeListVisible: true
    };
  }

  onMarkerClick = marker => {
    const location = this.state.places.filter(
      place => place.id === marker.id
    )[0];
    //marker allready selected ?
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
      this.infoWindow.close();
      info = null;
    } else {
      //stop animation for all markers
      this.stopMarkersAnimation();
      //animate only selected marker
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      info = null;

      //fetch data from Foursquare API
      this.getFSData(marker, this.infoWindow);
      if (info === null) {
        this.infoWindow.close();
        this.infoWindow.setContent(
          `<h3>Loading data for  ${location.name} ...</h3><h3>Please wait</h3>`
        );
        this.infoWindow.open(this.map, marker);
        this.infoWindow.marker = marker;
      } else {
        this.infoWindow.setContent(`<div>${info}</div>
        <h6>Source: <a href="https://developer.foursquare.com/">foursquare.com</a></h6>`);
      }
    }
  };

  getFSData = (marker, infowindow) => {
    let url =
      'https://api.foursquare.com/v2/venues/search?client_id=' +
      client_id +
      '&client_secret=' +
      client_secret +
      '&v=20180710&ll=' +
      marker.getPosition().lat() +
      ',' +
      marker.getPosition().lng() +
      '&limit=1';

    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        let innerHtml = '';
        innerHtml = `<div>`;

        let location_data = data.response.venues[0];
        let name = location_data.name;
        let city = location_data.location.city;
        let address = location_data.location.address;
        let readMore = `https://foursquare.com/v/${location_data.id}`;

        innerHtml += `<h2>${name}</h2>`;
        innerHtml += `<h3>${city}</h3>`;
        innerHtml += `<h3>${address}</h3>`;
        innerHtml += `<a href=${readMore} target="_blank">Read more...</a></a>`;
        innerHtml += `<h4>Source: <a href="https://developer.foursquare.com/">Foursquare</a></h4></div>`;

        info = innerHtml;
        infowindow.setContent(info);
      })
      .catch(err => {
        info = `<p>Error loading Foursquare API. Please try again later</p>`;
        infowindow.setContent(info);
      });
  };

  stopMarkersAnimation = () => {
    //stop all marker animation
    this.markers.forEach(marker => {
      marker.setAnimation(null);
      // this.setState({ clickedLocation: null })
    });
  };

  setSentMarkers = (map, markers) => {
    this.map = map;
    this.markers = markers;
    this.infoWindow = new window.google.maps.InfoWindow({ maxWidth: 180 });
    this.infoWindow.marker = null;
    this.infoWindow.addListener('closeclick', () => {
      this.stopMarkerAnimation();
    });
  };

  stopMarkerAnimation = () => {
    this.infoWindow.marker.setAnimation(null);
  };

  filterMarkers = filtered => {
    this.infoWindow.close();
    this.stopMarkersAnimation();
    info = null;
    // Nothing to filter ?
    if (filtered == null) {
      // Show all markers
      this.markers.forEach(marker => {
        marker.setVisible(true);
      });
    } else if (filtered.length > 0) {
      // Hide all markers
      this.markers.forEach(marker => {
        marker.setVisible(false);
      });
      // Show the corresponding marker
      let v = [];
      this.markers.forEach(m =>
        filtered.forEach(f => {
          if (m.id === f.id) v.push(m);
        })
      );
      v.forEach(marker => {
        marker.setVisible(true);
      });
      // this.markers.filter(marker => marker.id === filtered[0].id)[0].setVisible(true);
      // If there is no result after filteration
    } else {
      this.markers.forEach(marker => {
        marker.setVisible(false);
      });
    }
  };

  locationClick = loc => {
    const m = this.markers.filter(marker => marker.id === loc.id)[0];
    this.setState({ info: null });
    this.onMarkerClick(m);
  };

  togglePlaceList = () => {
    let isVisible = this.state.placeListVisible;
    this.setState({ placeListVisible: !isVisible });
    console.log('hamburger', this.state.placeListVisible);
  };

  render() {
    return (
      <div className='App' role='application'>
        <Map
          locations={places}
          onMarkerClick={this.onMarkerClick}
          sendMarkers={this.setSentMarkers}
          onMapClick={this.stopMarkersAnimation}
          togglePlaceList={this.togglePlaceList}
        />

        <PlaceList
          placeListVisible={this.state.placeListVisible}
          location_list={this.state.places}
          filter={this.filterMarkers}
          locationClick={this.locationClick}
        />
      </div>
    );
  }
}

export default App;
