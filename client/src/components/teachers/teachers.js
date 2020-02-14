import React, { Component } from 'react';
import './teachers.css';

class Teachers extends Component {

  constructor() {
    super();
    this.state = {
      teachers: []
    }
  }

  componentDidMount() {
    fetch('/api/teachersss')
    .then(res => res.json())
    .then(teachers => this.setState({teachers: teachers}, () => console.log(teachers)));
  }

  render() {
    return (
      <div>
        <h2>Teachers</h2>
          {this.state.teachers.map(teacher => 
            <h4 key={teacher.id}>{teacher.firstName}</h4>
          )}
      </div>
    );
  }

}

export default Teachers;
