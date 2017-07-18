import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ViewUsers from './viewUsers.js';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link, PropsRoute } from 'react-router-dom';
import Home from './home.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            navElements: {
                "topViewers": {
                    "text": "Top Viewers",
                    "active": true,
                    "path": "/ramez05"
                },
                "searchViewers": {
                    "text": "Search Viewers",
                    "active": false,
                    "path": "/users/view"
                },
                "chatLogs": {
                    "text": "Chat Logs",
                    "active": false,
                    "path":"/"
                }
            },
            page: 1,
            componentChange: false
        }
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.navClick = this.navClick.bind(this);
    }

    navClick(e) {
        var elemnet = $(e.currentTarget).attr('data-id');
        var object = this.state.navElements;
        Object.keys(object).map((keyName, keyIndex) => {
            if(keyName == elemnet) {
                object[keyName].active = true;
            } else {
                object[keyName].active = false;
            }
        });
        this.setState({navElements: object, componentChange: true});
    }

    navagation() {
        var object = this.state.navElements;
        var navagation = Object.keys(object).map((keyName, keyIndex) => {
            var classes = object[keyName].active ? "btn btn-default active" : "btn btn-default";
            return (
                <button key={keyIndex} className={classes} data-id={keyName} onClick={this.navClick}>{object[keyName].text}</button>
            );
        });
        return (
            <div>
                {navagation}
            </div>
        )
    }

    prevPage() {
        if(this.state.page - 1 > 0)
            this.setState({page: this.state.page - 1});
    }

    nextPage() {
        this.setState({page: this.state.page + 1});
    }

    getActiveComponent() {
        var object = this.state.navElements;
        var activeComponent = Object.keys(object).map((keyName, keyIndex) => {
            if(object[keyName].active) {
                if(keyName == "topViewers") {
                    return ( <Home page={this.state.page} refresh={this.state.componentChange}/> )
                } else if(keyName = "searchViewers") {
                    return ( <ViewUsers /> )
                }
            }
        });
        return (
            <div>
                {activeComponent}
            </div>
        )
    }

    render() {
        let navigation = this.navagation();
        var custom = this.props.custom;
        var welcome = () => { return <h1>Welcome!</h1> };
        var activhomeeComponent = this.getActiveComponent();
        var home = (this.state.navElements.topViewers.active) ?
        (<Home page={this.state.page} display={true}/>) :
        (<Home page={this.state.page} display={false}/>);
        var searchViewers = (this.state.navElements.searchViewers.active) ?
        (<ViewUsers display={true}/>) :
        (<ViewUsers display={false}/>);
        if(this.state) {
            return (
                <div>
                    <div className="header col-xs-12">
                        <h1>Twitch Chat Stats</h1>
                    </div>
                    <div className="appContainer">
                        <div className="navContainer col-sm-3 col-xs-12">
                            {navigation}
                        </div>
                        <div className="pageContainer col-sm-9 col-xs-12">
                            <button className="btn btn-default refresh"><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>
                                {home}
                                {searchViewers}
                            <button className="btn btn-default prev" onClick={this.prevPage}>Pervious</button> <button className="btn btn-default next" onClick={this.nextPage}>Next</button>
                        </div>
                    </div>
                    <script dangerouslySetInnerHTML={{
                        __html: 'window.PROPS=' + JSON.stringify(custom)
                    }} />
                </div>
            );
        }
        else {
            return (
                <div>Loading...</div>
            );
        }
    }
}

const mapStateToProps = (state) => {
  return {
    custom: state,
  }
}

const ConnectedApp = connect(mapStateToProps)(App)

export default ConnectedApp
