import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './navbar.css';

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      current: ""
    }
  }

  handleTeachersTap() {
    this.setState({current: "teachers"});
  }

  handleCoursesTap() {
    this.setState({current: "courses"});
  }

  render() {
    return (
      <div className="navbar">
          <Link to="/teachers">
            <h2 className={this.state.current == "teachers" ? "option-1 active-tab" : "option-1"} onClick={() => this.handleTeachersTap()}>Teachers</h2>
          </Link>
          <Link to="/courses">
          <h2 className={this.state.current == "courses" ? "option-2 active-tab" : "option-2"} onClick={() => this.handleCoursesTap()}>Courses</h2>
          </Link>
      </div>
    );
  }

}

export default Navbar;