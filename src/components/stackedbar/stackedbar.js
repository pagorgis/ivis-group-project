import React, { useEffect, useRef, Component} from "react";
import {
  select,
  scaleBand,
  axisBottom,
  axisTop,
  stack,
  stackOffsetDiverging,
  schemeCategory10,
  max,
  min,
  scaleLinear,
  scaleOrdinal,
  mouse,
  event,
  axisLeft,
  json,
} from "d3";
//import Teachers from "../../data/Teachers.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Dropdown} from "react-bootstrap";
import './stackedbar.css';


class StackedBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: ["Bonus","Penalty", "gru_ht", "gru_vt","self_dev","Extra","Unplanned"],
      colors: {
        "Bonus":"#4CAF50",
        "Penalty": "#F44336",
        "gru_ht": "rgb(228, 164, 26)",
        "gru_vt": "rgb(54, 98, 244)",
        "self_dev": "#FFEB3B",
        "Extra": "pink",
        "Unplanned":"white"
      },
      teachers_data: require('../../data/Teachers.json'),
      active_teacher: this.props.active_teacher,
    }

  }

  componentDidMount() {
    this.stackedBar();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_teacher !== prevState.active_teacher) {
      this.setState({ active_teacher: this.props.active_teacher });
      select("#myViz").remove();
      select("#mySVG").selectAll("*").remove();
      this.stackedBar();
    }
  }

  stackedBar () {
    const teacherdata=this.state.teachers_data[this.state.active_teacher-1];
    var colors = this.state.colors;
    var penalty=0;
    var bonus=0;
    var startFromPenalty=0;
    var hasPenalty=false;
    var onlyPenalty=false;
    if(teacherdata.gru_balance_19<0){
      if(teacherdata.gru_ht==0 && teacherdata.gru_vt==0 && teacherdata.self_dev==0){
        hasPenalty=true;
        onlyPenalty=true;
        penalty=-1*teacherdata.gru_balance_19;
        startFromPenalty=teacherdata.gru_balance_19;
      }else{
        hasPenalty=true;
        startFromPenalty=teacherdata.gru_balance_19;
    }
  }else{
    bonus=teacherdata.gru_balance_19;
  }

    var rest=(teacherdata.kontering-startFromPenalty-teacherdata.gru_ht-teacherdata.gru_vt-teacherdata.self_dev).toFixed(2);
    const checkRest=(rest)=>{
        if(rest>0){
            return rest;
        }else{
            return 0;
        }
    }

    const data = [
        {Bonus:bonus,Penalty: penalty, gru_ht: teacherdata.gru_ht, gru_vt: teacherdata.gru_vt, self_dev: teacherdata.self_dev,Extra:teacherdata.extra,Unplanned:checkRest(rest)},
      ];

    function stackMin(serie) {
      return min(serie, function(d) { return d[0]; });
    }
    
    function stackMax(serie) {
      return max(serie, function(d) { return d[1]; });
    }

    
    var series = stack()
    .keys(["Bonus","Penalty","gru_ht", "gru_vt", "self_dev","Extra","Unplanned"])
    .offset(stackOffsetDiverging)
    (data);

    var svg = select("#mySVG")
        .attr('width', 400)
        .attr('height', 125),
        margin = {top: 30, right: 20, bottom: 60, left: 30},
        width = 380,
        height = +svg.attr("height");

    var y = scaleBand()
        .domain(data.map(function(d) { return d.month; }))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.1);

    var x = scaleLinear()
        .domain([startFromPenalty, max(series, stackMax)])
        .rangeRound([margin.left, width - margin.right]);

    var z = scaleOrdinal(schemeCategory10);


    var tooltip = select("#myVis" )
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("text-align", "center")


    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      var keyText="";
      if(d.key=="gru_ht"){
        keyText="Autumn semester";
      }else if(d.key=="gru_vt"){
        keyText="Spring semester";
      }else if(d.key=="self_dev"){
        keyText="Self-development";
      }else if(d.key=="Bonus"){
        keyText="Bonus from last year"
      }else if(d.key=="Penalty"){
        keyText="Penalty from last year"
      }else{
        keyText=d.key;
      }

    tooltip
      .html(keyText+": "+((d[0][1]-d[0][0]).toFixed(2)+"%"))
        .style("opacity", 1)
    select(this)
          .style("stroke", "black")
          .style("stroke-width", 3)
          .style("stroke-opacity", 0.7)
    }

    var mouseoverPenalty = function(d) {
      tooltip
        .html(("Penalty: "+(teacherdata.gru_balance_19).toFixed(2)+"%"))
          .style("opacity", 1)
      select(this)
            .style("stroke", "black")
            .style("stroke-width", 3)
            .style("stroke-opacity", 0.7)
      }

    var mouseoverKontering = function(d) {
      tooltip
        .html(("Kontering: "+(teacherdata.kontering).toFixed(2)+"%"))
          .style("opacity", 1)
      select(this)
            .style("stroke", "black")
            .style("stroke-width", 3)
            .style("stroke-opacity", 0.7)
      }

    var mousemove = function(d) {
    tooltip
      .style("left", (event.pageX+"px"))
      .style("top", (event.pageY+30+"px"))
    }
    var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    select(this)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("stroke-opacity", 1)
    }

    var mouseleavePenalty = function(d) {
      tooltip
        .style("opacity", 0)
      select(this)
      .style("stroke", "none")
      }

    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
        .attr("fill", function(d) { return colors[d.key]; })
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("stroke-opacity", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("height", 22)
        .attr("y", function(d) { return y(d.data.month); })
        .attr("x", function(d) { 
          if(hasPenalty){
            return x((d[0]+teacherdata.gru_balance_19));
          }else{return x(d[0]); }})
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })


    svg.append("g")
      .attr("transform", "translate(0," + (margin.top+3) + ")")
      .call(axisTop(x));

    const kontLineEnd = teacherdata.kontering;
    const zeroLineEnd = 0;

    const konteringRect = svg.append("rect")
    .attr("height", 30)
    .attr("y", function(d) { return margin.top+3; })
    .attr("x", function(d) { return x(kontLineEnd)-(0.5*5)})
    .attr("width", 5)
    .attr("fill","black")
    .on("mouseover", mouseoverKontering)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleavePenalty);

    if(teacherdata.kontering!=0){
      const zeroLine = svg.append("line")
      .attr("x1", function(){ return x(zeroLineEnd)})
      .attr("x2", function(){ return x(zeroLineEnd)})
      .attr("y1", margin.top+3)
      .attr("y2", margin.top+40)
      .attr("stroke-width", 5)
      .attr("stroke", "black")

    }
 
  }

  render() {

    let t_data = this.state.teachers_data[this.state.active_teacher-1];

    return (
      <React.Fragment>
        <Row>
          <div className="profile">
            <div className="heading-box">
              <h1 style={{ width: '10rem' },{fontSize: "1.5rem"}} >{this.state.active_teacher === null ? null : t_data.name}</h1>
              <h3 style={{ width: '10rem' },{fontSize: "1rem"}} >{this.state.active_teacher === null ? null : t_data.position}, {this.state.active_teacher === null ? null : t_data.dept}</h3>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">Show Legend</Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item href="#/action-1"><div className="box" id="green-box" style={{marginRight: 20 + 'px'}}></div>Bonus from previous year</Dropdown.Item>
                  <Dropdown.Item href="#/action-1"><div className="box" id="red-box" style={{marginRight: 20 + 'px'}}></div>Penalty from previous year</Dropdown.Item>
                  <Dropdown.Item href="#/action-1"><div className="box" id="orange-box" style={{marginRight: 20 + 'px'}}></div>Total Autumn semester</Dropdown.Item>
                  <Dropdown.Item href="#/action-1"><div className="box" id="blue-box" style={{marginRight: 20 + 'px'}}></div>Total Spring semester</Dropdown.Item>
                  <Dropdown.Item href="#/action-1"><div className="box" id="yellow-box" style={{marginRight: 20 + 'px'}}></div>Self-development</Dropdown.Item>
                  <Dropdown.Item href="#/action-1"><div className="box" id="pink-box" style={{marginRight: 20 + 'px'}}></div>Extra</Dropdown.Item>
                  <Dropdown.Item href="#/action-1"><div className="box" id="white-box" style={{marginRight: 20 + 'px'}}></div>Unplanned</Dropdown.Item> 
                  <Dropdown.Item href="#/action-1"><div className="kontLine" style={{marginRight: 20 + 'px'}}></div>Kontering</Dropdown.Item> 
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div id="myVis">
            <svg id="mySVG" ></svg>
          </div>
        </Row>
      </React.Fragment>
    );
  }

}


export default StackedBar;
