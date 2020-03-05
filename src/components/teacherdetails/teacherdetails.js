import React, { Component } from 'react';
import './teacherdetails.css';
import StackedBar from '../stackedbar/stackedbar';
//import * as d3 from "d3";

class TeacherDetails extends Component {
  constructor() {
    super();
    this.state = {
      test: null
    }
  }

  render() {
    const id=10;  //teacher id
    return (
      <div className="teacherdetails">
        
        <StackedBar value={id}/>
      </div>
    );
  }

}

export default TeacherDetails;