import React, { Component } from 'react';

class PlaceList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '',
            locations: this.props.location_list
        }
    }

    search = (event) => {
        const value = event.target.value;
        this.setState({ query: value });
        // Filter locations
        const filtered = this.props.location_list.filter(loc => loc.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
        if (value !== "") {
            // Run the filteration handler on the App component
            this.props.filter(filtered);
        } else {
            this.props.filter(null);
        }
        this.setState({ locations: filtered });
    }


    render() {
        return (
            <div className={this.props.placeListVisible ? "search hide" : "search show"}>
                <input type="search" placeholder="search" value={this.state.query} onChange={this.search} aria-label="search" tabIndex="1" />

                <div>
                    {this.state.locations.map(loc =>
                        <div key={loc.id}
                            role="button"
                            aria-label="location"
                            onClick={() => { this.props.locationClick(loc) }}
                            onKeyPress={() => { this.props.locationClick(loc) }}
                            className="place"
                            tabIndex={loc.id + 1}
                        >
                            {loc.name}
                        </div>)}
                </div>

            </div>
        )
    }
}

export default PlaceList;