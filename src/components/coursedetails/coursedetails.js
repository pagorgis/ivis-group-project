import React, { Component } from 'react';
import './coursedetails.css';
//import * as d3 from "d3";

class CourseDetails extends Component {
  constructor() {
    super();
    this.state = {
      test: null
    }
  }

  render() {
    return (
      <div className="coursedetails">
        This is course details component
      </div>
    );
  }

}

export default CourseDetails;