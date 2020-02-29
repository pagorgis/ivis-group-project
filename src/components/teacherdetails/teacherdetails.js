import React, { Component } from 'react';
import './teacherdetails.css';
//import * as d3 from "d3";

class TeacherDetails extends Component {
  constructor() {
    super();
    this.state = {
      test: null
    }
  }

  render() {
    return (
      <div className="teacherdetails">
        This is teacher details component
      </div>
    );
  }

}

export default TeacherDetails;