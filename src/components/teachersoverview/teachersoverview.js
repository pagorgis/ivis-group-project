import React, { Component } from 'react';
import './teachersoverview.css';
//import * as d3 from "d3";

class TeachersOverview extends Component {
  constructor() {
    super();
    this.state = {
      current: ""
    }
  }

  render() {
    return (
      <div className="teachersoverview">
        This is teacher overview component
      </div>
    );
  }

}

export default TeachersOverview;