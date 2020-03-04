import React, { useEffect, useRef } from "react";
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
import Teachers from "../data/Teachers.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Dropdown} from "react-bootstrap";


  const keys = ["penalty", "gru_ht", "gru_vt","self_dev","extra","unplanned"];
  
  const colors = {
    "penalty": "#F44336",
    "gru_ht": "rgb(228, 164, 26)",
    "gru_vt": "rgb(54, 98, 244)",
    "self_dev": "#FFEB3B",
    "extra": "#4CAF50",
    "unplanned":"white"
  };
/**
 * Component that renders a StackedBarChart
 */

function StackedBar(inputId) {
    const id=inputId.value;
    console.log(Teachers[id-1]);
    const tearcherData=Teachers[id-1];

    var penalty=0;
    var startFromPenalty=0;
    var hasPenalty=false;
    if(tearcherData.gru_balance_19<0 && tearcherData.gru_ht==0 && tearcherData.gru_vt==0 && tearcherData.self_dev==0){
        penalty=tearcherData.gru_balance_19;
    }else if(tearcherData.gru_balance_19<0 && !(tearcherData.gru_ht==0 && tearcherData.gru_vt==0 && tearcherData.self_dev==0)){
        hasPenalty=true;
        startFromPenalty=tearcherData.gru_balance_19;
    }

    var rest=(tearcherData.kontering-startFromPenalty-tearcherData.gru_ht-tearcherData.gru_vt-tearcherData.self_dev).toFixed(2);
    const checkRest=(rest)=>{
        if(rest>0){
            return rest;
        }else{
            return 0;
        }
    }

    const data = [
        {penalty: penalty, gru_ht: tearcherData.gru_ht, gru_vt: tearcherData.gru_vt, self_dev: tearcherData.self_dev,extra:tearcherData.extra,unplanned:checkRest(rest)},
      ];

  // will be called initially and on every data change
  useEffect(() => {
    var series = stack()
    .keys(["penalty","gru_ht", "gru_vt", "self_dev","extra","unplanned"])
    .offset(stackOffsetDiverging)
    (data);

var svg = select("#mySVG"),
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
tooltip
   .html(((d[1]-d[0]).toFixed(2)+"%"))
    .style("opacity", 1)
select(this)
      .style("stroke", "black")
      .style("stroke-width", 3)
      .style("stroke-opacity", 0.7)
}

var mouseoverPenalty = function(d) {
  tooltip
     .html(("Penalty: "+(tearcherData.gru_balance_19).toFixed(2)+"%"))
      .style("opacity", 1)
  select(this)
        .style("stroke", "black")
        .style("stroke-width", 3)
        .style("stroke-opacity", 0.7)
  }

  var mouseoverKontering = function(d) {
    tooltip
       .html(("Kontering: "+(tearcherData.kontering).toFixed(2)+"%"))
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
  .selectAll("rect")
  .data(function(d) { return d; })
  .enter().append("rect")
    .attr("height", 22)
    .attr("y", function(d) { return y(d.data.month); })
    .attr("x", function(d) { 
      if(hasPenalty){
        return x((d[0]+tearcherData.gru_balance_19));
      }else{return x(d[0]); }})
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

svg.append("g")
    .attr("transform", "translate(0," + (margin.top+10) + ")")
    .call(axisTop(x));

const lineEnd = tearcherData.kontering;

  const konteringRect = svg.append("rect")
  .attr("height", 60)
  .attr("y", function(d) { return margin.top-10; })
  .attr("x", function(d) { return x(lineEnd)})
  .attr("width", 5)
  .attr("fill","black")
  .on("mouseover", mouseoverKontering)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleavePenalty);

  // var myText =  svg.append("text")
  // .attr("y", margin.bottom+40)
  // .attr("x", function(){ return x(lineEnd)})
  // .attr('text-anchor', 'middle')
  // .attr("class", "myLabel")
  // .text("Kontering");

  const penaltyRect = svg.append("rect")
  .attr("height", 8)
  .attr("y", function(d) { return margin.bottom+2; })
  .attr("x", function(d) { return x(tearcherData.gru_balance_19)})
  .attr("width", function(d) { return x(0)-x(startFromPenalty); })
  .attr("fill","red")
  .on("mouseover", mouseoverPenalty)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleavePenalty);
  
  }, [colors, data,keys]);


  return (
    <React.Fragment>
      <Row>
    <div className="profile">
          <div className="heading-box">
            <h1 style={{ width: '10rem' },{fontSize: "1.5rem"}} >{tearcherData.name}</h1>
            <h3 style={{ width: '10rem' },{fontSize: "1rem"}} >{tearcherData.position}, {tearcherData.dept}</h3>
            <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
        Show Legend
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1"><div className="box" id="red-box" style={{marginRight: 20 + 'px'}}></div>Penalty from previous year</Dropdown.Item>
        <Dropdown.Item href="#/action-1"><div className="box" id="blue-box" style={{marginRight: 20 + 'px'}}></div>Total Autumn semester</Dropdown.Item>
        <Dropdown.Item href="#/action-1"><div className="box" id="orange-box" style={{marginRight: 20 + 'px'}}></div>Total Spring semester</Dropdown.Item>
        <Dropdown.Item href="#/action-1"><div className="box" id="yellow-box" style={{marginRight: 20 + 'px'}}></div>Self-development</Dropdown.Item>
        <Dropdown.Item href="#/action-1"><div className="box" id="green-box" style={{marginRight: 20 + 'px'}}></div>Extra</Dropdown.Item>
        <Dropdown.Item href="#/action-1"><div className="box" id="grey-box" style={{marginRight: 20 + 'px'}}></div>Unplanned</Dropdown.Item> 
        <Dropdown.Item href="#/action-1"><div className="kontLine" style={{marginRight: 20 + 'px'}}></div>Kontering</Dropdown.Item> 
      </Dropdown.Menu>
    </Dropdown>
          </div>
    </div>
    <div id="myVis">
      <svg id="mySVG" width="400" height="200"></svg>
      </div>
      </Row>
    <div>

    </div>

    </React.Fragment>
  );
}



function stackMin(serie) {
  return min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
  return max(serie, function(d) { return d[1]; });
}



export default StackedBar;
