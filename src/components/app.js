import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ViewUsers from './viewUsers.js';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        var custom = this.props.custom;
        console.log(custom);
        var welcome = () => { return <h1>Welcome!</h1> };
        if(this.state) {
            return (
                <Router>
                    <div>
                        <div className="header col-xs-12">
                            <h1>Twitch Chat Stats</h1>
                        </div>
                        <div className="appContainer">
                            <div className="pageContainer col-sm-9 col-xs-12">
                                <Switch>
                                    <Route name="viewUsers" path='/users/view' component={ViewUsers}/>
                                    <Route path='/' render={()=>(<h1>Welcome!</h1>)}/>
                                </Switch>
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
