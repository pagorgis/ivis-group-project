import React, { Component } from 'react';
import './coursesoverview.css';
//import * as d3 from "d3";

class CoursesOverview extends Component {
  constructor() {
    super();
    this.state = {
      current: ""
    }
  }

  render() {
    return (
      <div className="coursesoverview">
        This is courses overview componenta
      </div>
    );
  }

}

export default CoursesOverview;