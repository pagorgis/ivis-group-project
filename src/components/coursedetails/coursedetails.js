import React, { Component } from 'react';
import './coursedetails.css';

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
        This is course details
      </div>
    );
  }

}

export default CourseDetails;