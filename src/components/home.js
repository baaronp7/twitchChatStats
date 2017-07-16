import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ViewUsers from './viewUsers.js';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Bars from 'react-bars';


class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authinticated: true,
            channel: {},
            viewers: [],
            viewersData: []
        }
    }

    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if((nextProps.custom.viewers != this.props.custom.viewers) || (nextProps.page !== this.props.page))
            return true;
        else
            return false;
    }

    componentWillReceiveProps(nextProps) {
        var custom = nextProps.custom;
        this.setState({channel: custom.channel, viewers: custom.viewers});
        if(custom.viewers.length > 0) {
            var viewersData = custom.viewers.map((viewer) => {
                return {label: viewer.displayName, value: viewer.messageCount}
            });
            viewersData.sort(this.dynamicSort("value"));
            var pageEnd = nextProps.page * 10;
            var pageStart =  pageEnd - 10;
            this.setState({viewersData: viewersData.slice(pageStart, pageEnd)});
        }
    }

    render() {
        var welcome = () => { return <h1>Welcome!</h1> };
        if(!this.state.authinticated) {
            return (
                <div>
                    <label>What Channel do you wnat stats for?</label>
                    <input className="form-control" value="" placeholder="Channel ID"/>
                    <button className="channelSubmit btn btn-info">Connect</button> 
                </div>
            );
        }
        else {
            return (
                <div className="barContainer">
                    <Bars data={this.state.viewersData} showValue={true} />
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
  return {
    custom: state,
  }
}

const ConnectedApp = connect(mapStateToProps)(Home)

export default ConnectedApp