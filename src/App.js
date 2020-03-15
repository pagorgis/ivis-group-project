import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import TeachersOverview from './components/teachersoverview/teachersoverview';
import CoursesOverview from './components/coursesoverview/coursesoverview';
import TeacherDetails from './components/teacherdetails/teacherdetails';
import CourseDetails from './components/coursedetails/coursedetails';
import InfoPage from './components/infopage/infopage';
//import * as d3 from "d3";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: "teachers",
      infotab: false,
      active_teacher: null,
      active_course: null,
      clicked_teacher_from_outside: false,
      clicked_course_from_outside: false,
      clicked_reset: false,
      teachers_data: require('./data/Teachers.json'),
      courses_data: require('./data/Courses.json')
    }

    this.handleOverviewChange = this.handleOverviewChange.bind(this);
    this.clickedStaffiz = this.clickedStaffiz.bind(this);
    this.clickedInfo = this.clickedInfo.bind(this);
    this.clickedReset = this.clickedReset.bind(this);
  }

  componentDidMount() {
    //console.log(this.state.courses_data);
    //console.log(this.state.teachers_data);
  }

  clickedInfo() {
    this.setState({infotab: true})
  }

  clickedStaffiz() {
    this.setState({infotab: false})
  }

  clickedReset() {
    this.setState({ clicked_teacher_from_outside: true, clicked_course_from_outside: true, active_teacher: null, active_course: null, clicked_reset: true})
  }

  resetReset() {
    this.setState({clicked_reset: false})
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
      this.setState({tab: "courses", clicked_teacher_from_outside: false, clicked_course_from_outside: false});
    } else if (tab === "courses") {
      this.setState({tab: "teachers", clicked_teacher_from_outside: false, clicked_course_from_outside: false});
    }
  }

  render() {

    let visualization = 
      <>
        <div className="overview-bar">
          <div className="divTeachersTab">
            <h2 className={this.state.tab === "teachers" ? "teachers-tab active" : "teachers-tab"} onClick={() => this.handleOverviewChange("courses")}>Teachers</h2>
            <div className="hideRectangleTeachers"></div>
          </div>
          <div className="divCoursesTab">
            <h2 className={this.state.tab === "courses" ? "courses-tab active" : "courses-tab"} onClick={() => this.handleOverviewChange("teachers")}>Courses</h2>
            <div className="hideRectangleCourses"></div>
          </div>
          <div className="reset-tab">
            <h2 className="reset-button" onClick={() => this.clickedReset()}>Reset</h2>
            <div className="hideRectangleCourses"></div>
          </div>
        </div>
        <div className="flex-container">
          <div className="flex-1">
            {this.state.tab === "teachers" ? <TeachersOverview 
              active_teacher={this.state.active_teacher} 
              teacherIdUpdate={newValue => this.teacherIdUpdate(newValue)} 
              resetTeacherFromOutside={() => this.resetTeacherFromOutside()} 
              clicked_teacher_from_outside={this.state.clicked_teacher_from_outside}
              clicked_reset={this.state.clicked_reset}
              resetReset={() => this.resetReset()} 
              /> 
              : null}
            {this.state.tab === "courses" ? <CoursesOverview 
              active_course={this.state.active_course} 
              courseIdUpdate={newValue => this.courseIdUpdate(newValue)} 
              resetCourseFromOutside={() => this.resetCourseFromOutside()} 
              clicked_course_from_outside={this.state.clicked_course_from_outside}
              clicked_reset={this.state.clicked_reset}
              resetReset={() => this.resetReset()} 
              /> 
              : null}
          </div>
          <div className="flex-2">
            {<TeacherDetails active_teacher={this.state.active_teacher} active_course={this.state.active_course} courseIdUpdate={newValue => this.courseIdUpdate(newValue)} courseClick={() => this.clickedCourseFromOutside()}/>}
            {<CourseDetails active_course={this.state.active_course} active_teacher={this.state.active_teacher} teacherIdUpdate={newValue => this.teacherIdUpdate(newValue)} teacherClick={() => this.clickedTeacherFromOutside()}/>}
          </div>
        </div>
      </>

    return(
      <Router>
        <div className="App">
          <div className="staffiz-banner">
            <button className="staffiz-title" onClick={this.clickedStaffiz}>Staffiz</button>
            <button className="info-title" onClick={this.clickedInfo}>Info</button>
          </div>
        <Route exact path="/" render={() => this.state.infotab ? <InfoPage /> : visualization} />
      </div>
      </Router>
    );
  }
}

export default App;
