import React, { Component } from 'react';
import './teacherdetails.css';

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
        This is teacher details
      </div>
    );
  }

}

export default TeacherDetails;