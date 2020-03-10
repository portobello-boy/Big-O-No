import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

// Routes
import App from './App';
import Canvas from './canvas';
import Logic from './logic';


ReactDOM.render(
    <BrowserRouter>
        <Route path="/" component={Canvas}/>
        {/* <Route path="/canvas" component={Canvas}/> */}
    </BrowserRouter>,
    // <App />, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
