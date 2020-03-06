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
      active_teacher: 2,
      active_course: 2,
      teachers_data: require('./data/Teachers.json'),
      courses_data: require('./data/Courses.json')
    }

    this.handleOverviewChange = this.handleOverviewChange.bind(this);
  }

  componentDidMount() {
    //console.log(this.state.courses_data);
    //console.log(this.state.teachers_data);
  }

  teacherIdUpdate(id) {
    this.setState({active_teacher: id})
  }

  courseIdUpdate(id) {
    this.setState({active_course: id})
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
          <div className="overview-bar">
            <h2 className={this.state.tab === "teachers" ? "teachers-tab active" : "teachers-tab"} onClick={() => this.handleOverviewChange("courses")}>Teachers</h2>
            <h2 className={this.state.tab === "courses" ? "courses-tab active" : "courses-tab"} onClick={() => this.handleOverviewChange("teachers")}>Courses</h2>
          </div>
          <div className="flex-container">
            <div className="flex-1">
              {this.state.tab === "a" ? <TeachersOverview active_teacher={this.state.active_teacher} teacherIdUpdate={newValue => this.teacherIdUpdate(newValue)} /> : null}
              {this.state.tab === "a" ? <CoursesOverview active_course={this.state.active_course} courseIdUpdate={newValue => this.courseIdUpdate(newValue)} /> : null}
            </div>
            <div className="flex-2">
              {this.state.active_teacher === null ? null : <TeacherDetails active_teacher={this.state.active_teacher} />}
              {this.state.active_course !== 'a' ? null : <CourseDetails active_course={this.state.active_course} teacherIdUpdate={newValue => this.teacherIdUpdate(newValue)} />}
            </div>
          </div>
        </div>
    );
  }
}

export default App;
