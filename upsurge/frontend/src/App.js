import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

// Get CSS
import './App.css';

// Grab route components
import Canvas from './canvas';
import Logic from './logic';


class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Canvas} />
          <Route path='/logic' component={Logic} />
        </Switch>
      </div>
    );
  }
}

export default App;
