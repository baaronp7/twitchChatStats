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
            page: 1
        }
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    navagation() {
        var object = this.state.navElements;
        var navigation = Object.keys(object).map((keyName, keyIndex) => {
            var className = 'btn btn-default ' + (object[keyName].active ? 'active' : '');
            return (                
                <Link key={keyIndex} to={object[keyName].path} className={className}>{object[keyName].text}</Link>
            );
        });
        return (
            <div>
                {navigation}
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

    render() {
        let navigation = this.navagation();
        var custom = this.props.custom;
        var welcome = () => { return <h1>Welcome!</h1> };
        if(this.state) {
            return (
                <Router>
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
                                <Switch>
                                    <Route name="viewUsers" path='/users/view' component={ViewUsers}/>
                                    <Route path='/' render={()=><Home page={this.state.page}/>}/>
                                </Switch>
                                <button className="btn btn-default prev" onClick={this.prevPage}>Pervious</button> <button className="btn btn-default next" onClick={this.nextPage}>Next</button>
                            </div>
                        </div>
                        <script dangerouslySetInnerHTML={{
                            __html: 'window.PROPS=' + JSON.stringify(custom)
                        }} />
                    </div>
                </Router>
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
