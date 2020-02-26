import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar/navbar';

class App extends Component {

  render() {
    return(
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" render={() => <></>}/>
        </div>
      </Router>
    );
  }
}

export default App;
