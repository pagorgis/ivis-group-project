import React, { Component } from 'react';
import './piechart.css';
import * as d3 from "d3";

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active_course: this.props.active_course,
      active_teacher: this.props.active_teacher,
      courses_data: require('../../data/Courses.json')
    }
  }

  componentDidMount() {
    this.myPieChart();  
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_course !== prevState.active_course) {
      this.setState({ active_course: this.props.active_course });
      d3.select("#pie_chart").selectAll("*").remove();
      this.myPieChart();
    }
    if (this.props.active_teacher !== prevState.active_teacher) {
      this.setState({ active_teacher: this.props.active_teacher });
      d3.select("#pie_chart").selectAll("*").remove();
      this.myPieChart();
    }
    
  }

  
  myPieChart(){

    var data = this.state.courses_data;
    var idTeacher = 19;
    var idCourse = 16;

    console.log(this.state.courses_data[2]);


    var svg = d3.select("#pie_chart")
        .append("svg")
        //.attr('width', 500)
        //.attr('height', 500)
        .append("g")

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var width = 250,
        height = 250,
        radius = Math.min(width, height) / 4;

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.arc()
        .outerRadius(radius * 0.7)
        .innerRadius(radius * 0.4);

    var outerArc = d3.arc()
        .innerRadius(radius * 0.8)
        .outerRadius(radius * 0.8);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d){ return d.data.label; };

    var color = d3.scaleOrdinal()
        .domain(["Handledning","Föreläsning", "Övning", "Laboration", "Examination", "Kursutveckling", "Administration"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var teacher = findTeacher();

    var totalHours = calculationOfTotal(teacher);

    var teacherHoursArray= partArray(teacher);

    var teacherData = teacherPieData(teacherHoursArray);

    draw(teacherData);

    var tooltip = floatingTooltip('teachersdetails_pieChart_tooltip', 30);

    /*
  * Function called on mouseover to display the
  * details of a bubble in the tooltip.
  */
    function showDetail(d) {


        var content = '<span class="name">'+d.value+' </span><span class="value"> Hours</span><br/>';

        tooltip.showTooltip(content, d3.event);
    }

    /*
  * Hides tooltip
  */
    function hideDetail(d) {

        tooltip.hideTooltip();
    }


    /*
    Helping functions
    */

    function findTeacher(){
        var d = data[idCourse-1];

        var teacher = null;

        for (var i=0;i<d.teachers.length;i++){
            if (d.teachers[i].teacher_id===idTeacher){
                teacher = d.teachers[i];
            }
        }
        console.log(teacher);
        return teacher;
    }

    function calculationOfTotal(teacher){
        if (teacher){
            var total=0;
            for (var i=0;i<teacher.part.length;i++){
                total+=teacher.part[i].hours;
            }
            console.log(total);
            return total;
        }
    }

    /*
    returns the array of the values for each category of the course in this order:
    ["ha", "frl", "ovn", "la", "ex", "ku", "adm"];
    */
    function partArray(teacher){
        if (teacher){
            var arrayLabels= ["ha", "frl", "ovn", "la", "ex", "ku", "adm"];
            var arrayValues= [0,0,0,0,0,0,0]

            for (var i = 0; i <teacher.part.length ; i++) {
                var position=positionInArray(arrayLabels, teacher.part[i].type);
                if (position!==-1){
                    arrayValues[position]=teacher.part[i].hours;
                }
            }
            console.log(arrayValues);
            return arrayValues;
        }
    }

    /*
    returns the position of the element "label" in an array of strings
    returns -1 if not in the array
    */
    function positionInArray(array, label){
        for (var i = 0; i < array.length; i++) {
            if (array[i]===label){
                return i;
            }
        }
        return (-1);
    }

    /*
    returns the data for the pie chart as {label:label, value:value}
    */
    function teacherPieData (teacherHoursArray){

        if (teacherHoursArray){
            var allLabels = color.domain();
            var labels = [];
            var labelsPositions = [];

            for (var i = 0; i < teacherHoursArray.length; i++) {
                if (teacherHoursArray[i]!==0){
                    labels.push(allLabels[i]);
                    labelsPositions.push(i);
                }
            }

            return labels.map(function(label){
                var value=0;

                for (var j=0;j<labels.length;j++){
                    if (label===labels[j]){
                        value = teacherHoursArray[labelsPositions[j]];
                    }
                }

                //console.log({ label: label, value: value });

                return { label: label, value: value }
            });
        }
    }

    /*
    draw the pie chart
    */
      function draw(data){

          /* ------- Circle in the middle + text ------------- */

          svg.append("circle")
              .attr('r', radius*0.4)
              .attr('fill', "white");

          svg.append('text')
              .text(totalHours)
              .attr('y', -7)
              .attr("font-family", "sans-serif")
              .attr("font-size", "0.8em")
              .attr("fill", "black")
              .attr("text-anchor", "middle");

          svg.append('text')
              .text("Hours")
              .attr('y', +13)
              .attr("font-family", "sans-serif")
              .attr("font-size", "0.8em")
              .attr("fill", "black")
              .attr("text-anchor", "middle");

          svg.selectAll('path')
              .data(pie(data))
              .enter()
              .append('path')
              .attr('d', arc)
              .style("fill", function(d) { return color(d.data.label); })
              .on('mouseover', showDetail)
              .on('mouseout', hideDetail);

          svg.append('g').classed('labels',true);
          svg.append('g').classed('lines',true);


          var polyline = svg.select('.lines')
              .selectAll('polyline')
              .data(pie(data))
              .enter().append('polyline')
              .attr('points', function(d) {

                  // see label transform function for explanations of these three lines.
                  var pos = outerArc.centroid(d);
                  pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                  return [arc.centroid(d), outerArc.centroid(d), pos]
              });



          var label = svg.select('.labels').selectAll('text')
              .data(pie(data))
              .enter().append('text')
              .attr('dy', '.35em')
              .attr('font-size', '0.8em')
              .html(function(d) {
                  return d.data.label;
              })
              .attr('transform', function(d) {
                  var pos = outerArc.centroid(d);
                  pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                  return 'translate(' + pos + ')';
              })
              .style('text-anchor', function(d) {
                  return (midAngle(d)) < Math.PI ? 'start' : 'end';
              });

          function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
      }



    function floatingTooltip(tooltipId) {
      // Local variable to hold tooltip div for
      // manipulation in other functions.
      var tt = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .attr('id', tooltipId)
          .style('pointer-events', 'none');


      // Initially it is hidden.
      hideTooltip();

      /*
       * Display tooltip with provided content.
       *
       * content is expected to be HTML string.
       *
       * event is d3.event for positioning.
       */
      function showTooltip(content, event) {
          tt.style('opacity', 1.0)
              .html(content);

          updatePosition(event);
      }

      /*
       * Hide the tooltip div.
       */
      function hideTooltip() {
          tt.style('opacity', 0.0);
      }

      /*
       * Figure out where to place the tooltip
       * based on d3 mouse event.
       */
      function updatePosition(event) {
          var xOffset = 20;
          var yOffset = 10;

          var ttw = tt.style('width');
          var tth = tt.style('height');

          var wscrY = window.scrollY;
          var wscrX = window.scrollX;

          var curX = (document.all) ? event.clientX + wscrX : event.pageX;
          var curY = (document.all) ? event.clientY + wscrY : event.pageY;

          var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
              curX - ttw - xOffset * 2 : curX + xOffset;

          if (ttleft < wscrX + xOffset) {
              ttleft = wscrX + xOffset;
          }

          var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
              curY - tth - yOffset * 2 : curY + yOffset;

          if (tttop < wscrY + yOffset) {
              tttop = curY + yOffset;
          }

          tt.style("top", tttop +"px")
          tt.style("left", ttleft + "px");
      }

      return {
          showTooltip: showTooltip,
          hideTooltip: hideTooltip,
          updatePosition: updatePosition
      };
    }
  }


  render() {
    const id=10;  //teacher id
    return (
      <div id="pie_chart">
      </div>
    );
  }

}

export default PieChart;