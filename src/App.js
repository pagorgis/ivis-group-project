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
      active_course: null,
      clicked_teacher_from_outside: false,
      clicked_course_from_outside: false,
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

  clickedTeacherFromOutside() {
    this.setState({clicked_teacher_from_outside: true});
  }

  resetTeacherFromOutside() {
    this.setState({clicked_teacher_from_outside: false});
  }

  clickedCourseFromOutside() {
    this.setState({clicked_course_from_outside: true});
  }

  resetCourseFromOutside() {
    this.setState({clicked_course_from_outside: false});
  }

  handleOverviewChange(tab) {
    if (tab === "teachers") {
      this.setState({tab: "courses", clicked_teacher_from_outside: false, clicked_course_from_outside: false, active_teacher: null, active_course: null});
    } else if (tab === "courses") {
      this.setState({tab: "teachers", clicked_teacher_from_outside: false, clicked_course_from_outside: false, active_teacher: null, active_course: null});
    }
  }

  render() {
    return(
        <div className="App">
          <div className="staffiz-banner">
            <h1 className="staffiz-title">Staffiz</h1>
          </div>
          <div className="overview-bar">
            <div className="divTeachersTab">
              <h2 className={this.state.tab === "teachers" ? "teachers-tab active" : "teachers-tab"} onClick={() => this.handleOverviewChange("courses")}>Teachers</h2>
              <div className="hideRectangleTeachers"></div>
            </div>
            <div className="divCoursesTab">
              <h2 className={this.state.tab === "courses" ? "courses-tab active" : "courses-tab"} onClick={() => this.handleOverviewChange("teachers")}>Courses</h2>
              <div className="hideRectangleCourses"></div>
            </div>
          </div>
          <div className="flex-container">
            <div className="flex-1">
              {this.state.tab === "teachers" ? <TeachersOverview active_teacher={this.state.active_teacher} teacherIdUpdate={newValue => this.teacherIdUpdate(newValue)} resetTeacherFromOutside={() => this.resetTeacherFromOutside()} clicked_teacher_from_outside={this.state.clicked_teacher_from_outside}/> : null}
              {this.state.tab === "courses" ? <CoursesOverview active_course={this.state.active_course} courseIdUpdate={newValue => this.courseIdUpdate(newValue)} resetCourseFromOutside={() => this.resetCourseFromOutside()} clicked_course_from_outside={this.state.clicked_course_from_outside}/> : null}
            </div>
            <div className="flex-2">
              {<TeacherDetails active_teacher={this.state.active_teacher} active_course={this.state.active_course} courseIdUpdate={newValue => this.courseIdUpdate(newValue)} courseClick={() => this.clickedCourseFromOutside()}/>}
              {<CourseDetails active_course={this.state.active_course} active_teacher={this.state.active_teacher} teacherIdUpdate={newValue => this.teacherIdUpdate(newValue)} teacherClick={() => this.clickedTeacherFromOutside()}/>}
            </div>
          </div>
        </div>
    );
  }
}

export default App;
