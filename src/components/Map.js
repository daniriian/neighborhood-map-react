import React, { Component } from 'react';

class Map extends Component {

    componentDidMount() {
        window.initMap = this.initMap;

        // Asynchronously load Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyDfXtdZ3qGQ0hVQkPdf2mU1mEYl3hvhpOs&callback=initMap')
    }

    initMap() {
        const mapview = document.getElementById('map');

        const map = new window.google.maps.Map(mapview, {
            center: { lat: 46.7667271, lng: 23.5823639 },
            zoom: 14,
            mapTypeControl: false
        });
    }


    render() {
        return (
            <div id="map">

            </div>
        );
    }
}

export default Map;

function loadMapJS(src) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
