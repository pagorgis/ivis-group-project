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
  }

  render() {
    const id=10;  //teacher id
    return (
      <div className="teacherdetails">
        <StackedBar active_teacher={this.state.active_teacher}/>
        <Icicle active_teacher={this.state.active_teacher} courseIdUpdate={this.props.courseIdUpdate} />
        <PieChart active_teacher={this.state.active_teacher} active_course={this.state.active_course} />
      </div>
    );
  }

}

export default TeacherDetails;