import React, { Component } from 'react';
import './App.css';
//import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import TeachersOverview from './components/teachersoverview/teachersoverview';
import CoursesOverview from './components/coursesoverview/coursesoverview';
import TeacherDetails from './components/teacherdetails/teacherdetails';
import CourseDetails from './components/coursedetails/coursedetails';
//import * as d3 from "d3";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: "teachers",
      active_teacher: null,
      active_course: null
    }

    this.handleOverviewChange = this.handleOverviewChange.bind(this);
  }

  handleOverviewChange(tab) {
    if (tab === "teachers") {
      this.setState({tab: "courses"});
    } else if (tab === "courses") {
      this.setState({tab: "teachers"});
    }
  }

  render() {
    return(
        <div className="App">
          <div className="staffiz-banner">
            <h1 className="staffiz-title">Staffiz</h1>
          </div>
          <div className="flex-container">
            <div className="flex-1">
              <div className="overview-bar">
                <h2 className={this.state.tab === "teachers" ? "teachers-tab active" : "teachers-tab"} onClick={() => this.handleOverviewChange("courses")}>Teachers</h2>
                <h2 className={this.state.tab === "courses" ? "courses-tab active" : "courses-tab"} onClick={() => this.handleOverviewChange("teachers")}>Courses</h2>
              </div>
              {this.state.tab === "teachers" ? <TeachersOverview /> : null}
              {this.state.tab === "courses" ? <CoursesOverview /> : null}
            </div>
            <div className="flex-2">
              <TeacherDetails />
              <CourseDetails />
            </div>
          </div>
        </div>
    );
  }
}

export default App;
