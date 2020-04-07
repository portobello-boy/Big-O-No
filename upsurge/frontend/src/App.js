import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

// Get CSS
import './App.css';

// Grab route components
import Canvas from './canvas';
import Logic from './logic';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // circuit: {}
    }

    this.retrieveCircuit = this.retrieveCircuit.bind(this);
  }

  retrieveCircuit(response) {
    // console.log(response);
    this.setState({
      circuit: response
    });
  }

  render() {
    return (
      <div>
        <Switch>
          {/* <Route exact path='/' component={Canvas} getCircuit={this.retrieveCircuit}/> */}
          <Route 
            exact path='/'
            render={(props) => <Canvas {...props} getCircuit={this.retrieveCircuit} />}
          />
          {/* <Route path='/logic' component={Logic} passCircuit={this.state.circuit}/> */}
          <Route 
            exact path='/logic'
            render={(props) => <Logic {...props} passCircuit={this.state.circuit} />}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
