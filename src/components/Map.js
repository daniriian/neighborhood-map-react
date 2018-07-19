import React, { Component } from 'react';
import { myStyledMap } from '../Style/MapStyle.js';


class Map extends Component {

    componentDidMount() {
        window.initMap = this.initMap;

        // Asynchronously load Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyDfXtdZ3qGQ0hVQkPdf2mU1mEYl3hvhpOs&callback=initMap')
    }

    initMap = () => {
        const mapview = document.getElementById('map');
        //add style to map
        var styledMapType = new window.google.maps.StyledMapType(myStyledMap,
            { name: 'Styled Map' });

        console.log(myStyledMap);

        //instantiate the map
        const map = new window.google.maps.Map(mapview, {
            center: { lat: 46.775152, lng: 23.568993 },
            zoom: 14,
            mapTypeControl: false,
            mapTypeControlOptions: {
                mapTypeIds: ['styled_map']
            }
        });

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        //Create markers
        let markers = this.props.locations.map(location => {
            return new window.google.maps.Marker({
                position: location.position,
                map: map,
                animation: window.google.maps.Animation.DROP,
                title: location.name,
                id: location.id
            })
        });

        //Event handler for markers (click)
        markers.forEach(marker => {
            marker.addListener('click', () => {
                this.props.onMarkerClick(marker);
            });
        });

        //send all markers to parent component
        this.props.sendMarkers(map, markers);

    }


    render() {
        return (
            <div className="map_container">
                <div className="top_bar">
                    <h1>Neighborhood Map</h1>
                    <div
                        className="h_button"
                        role="button"
                        aria-label="menu"
                        onClick={() => { this.props.togglePlaceList() }}
                        onKeyPress={() => { this.props.togglePlaceList() }}
                        tabindex="1"
                    >
                        &#9776;
                    </div>
                </div>

                <div id="map" aria-label="map" tabindex="-1">
                </div>

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
        alert("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
