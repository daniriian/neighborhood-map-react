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
            <div className="search">
                <input type="search" placeholder="search" value={this.state.query} onChange={this.search} />

                <div>
                    {this.state.locations.map(loc =>
                        <div key={loc.id}
                            role="button"
                            aria-label="location"
                            onClick={() => { this.props.locationClick(loc) }}
                        /*    className={loc.clicked ? "location clicked" : "location"}*/
                        >
                            {loc.name}
                        </div>)}
                </div>

            </div>
        )
    }
}

export default PlaceList;