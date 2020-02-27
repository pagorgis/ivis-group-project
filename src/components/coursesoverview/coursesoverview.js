import React, { Component } from 'react';
import './coursesoverview.css';

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
          This is courses overview
      </div>
    );
  }

}

export default CoursesOverview;