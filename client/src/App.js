import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Teachers from './components/teachers/teachers';
import Courses from './components/courses/courses';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Route exact path="/" render={() => <></>}/>
        <Route exact path="/teachers" render={() => <Teachers />}/>
        <Route exact path="/courses" render={() => <Courses />}/>
        <Route path="/teacher/:id" render={() => <></>}/>
        <Route path="/course/:id" render={() => <></>}/>
      </div>
    </Router>
    
  );
}

export default App;
