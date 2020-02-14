import React, { Component } from 'react';
import './courses.css';

class Courses extends Component {

  constructor() {
    super();
    this.state = {
        courses: []
    }
  }

  componentDidMount() {
    fetch('/api/coursesss')
    .then(res => res.json())
    .then(courses => this.setState({courses: courses}, () => console.log(courses)));
  }

  render() {
    return (
      <div>
        <h2>Courses</h2>
          {this.state.courses.map(course => 
            <h4 key={course.id}>{course.name} ({course.code})</h4>
          )}
      </div>
    );
  }

}

export default Courses;
