import React, { Component } from 'react';
import './teacherdetails.css';
import StackedBar from '../StackedBar.js'
//import * as d3 from "d3";

class TeacherDetails extends Component {
  constructor() {
    super();
    this.state = {
      test: null
    }
  }

  render() {
    const id=1;
    return (
      <div className="teacherdetails">
        This is teacher details component
        <StackedBar value={id}/>
      </div>
    );
  }

}

export default TeacherDetails;