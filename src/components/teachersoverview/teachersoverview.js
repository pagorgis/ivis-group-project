import React, { Component } from 'react';
import './teachersoverview.css';

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
        This is teacher overview
      </div>
    );
  }

}

export default TeachersOverview;