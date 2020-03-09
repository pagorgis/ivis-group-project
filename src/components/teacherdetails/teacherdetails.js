import React, { Component } from 'react';
import './teacherdetails.css';
import StackedBar from '../stackedbar/stackedbar';
import Icicle from '../icicle/icicle';
import PieChart from '../piechart/piechart';
//import * as d3 from "d3";

class TeacherDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active_teacher: this.props.active_teacher,
      active_course: this.props.active_course
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_teacher !== prevState.active_teacher) {
      this.setState({ active_teacher: this.props.active_teacher });
    }
    if (this.props.active_course !== prevState.active_course) {
      this.setState({ active_course: this.props.active_course });
    }
  }

  render() {
    return (
      <div className="teacherdetails">
        <StackedBar active_teacher={this.state.active_teacher}/>
        <div className="td-flex-container" style={{paddingTop:"60px"}}>
          <div className="td-flex-1">
            <Icicle active_teacher={this.state.active_teacher} courseIdUpdate={this.props.courseIdUpdate} />
          </div>
          <div className="td-flex-2">
            <PieChart active_teacher={this.state.active_teacher} active_course={this.state.active_course} />
          </div>
        </div>  
      </div>
    );
  }

}

export default TeacherDetails;