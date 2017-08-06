import React from 'react';

class ViewUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.display != this.props.display)
            return true;
        else
            return false;
    }

    render() {
        var divStyle =  {
            display: this.props.display ? 'block' : 'none',
            minHeight: 300
        };
        return (
            <div className="searchContainer" style={divStyle}>
                <label>Search for Twitch ID</label>
                <input className="form-control" value="" placeholder="Twitch ID"/>
                <button className="viewerSearch btn btn-info">Search</button> 
            </div>
        );
    }
}

export default ViewUsers