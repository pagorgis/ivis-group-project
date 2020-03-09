import React, { Component } from 'react';
import './coursesoverview.css';
import './auto_complete.css';
import * as d3 from "d3";

class CoursesOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses_data: require('../../data/Courses.json'),
      active_course: this.props.active_course
    }
  }

  componentDidMount() {
    let myBubbleChart = this.bubbleChart();
    myBubbleChart('#coursesoverview_vis', this.state.courses_data);
    //this.autocomplete(document.getElementById("teachersoverview_teacherSearch"), this.teachersNames(this.state.teachers_data));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_course !== prevState.active_course) {
      this.setState({ active_course: this.props.active_course });
      //d3.select("#coursesoverview_vis_vis").selectAll("*").remove();
      //let myBubbleChart = this.bubbleChart();
      //myBubbleChart('#coursesoverview_vis', this.state.courses_data);
    }
  }
  

  bubbleChart() {
    var propfunction = this.props.courseIdUpdate;
    var courseId = this.state.active_course;
    const rawData = this.state.courses_data;
    let coursesNames = this.coursesNames(rawData);
    // Constants for sizing
      var width = 800;
      var height = 730;
  
    // tooltip for mouseover functionality
    var tooltip = this.floatingTooltip('gates_tooltip', 30);
  
    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    var center = { x: width / 2, y: height / 2 };

    console.log(center);

  var filterSplitCenters = {
    1: { x: width / 2, y: height / 2.7 },
    0: { x: width / 2, y: 2*height / 3.4 }
  };

  // Y locations of the filter split titles.
  var filterSplitTitles = {
    filtered: 70,
    notFiltered: height-70
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.05;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var groups = null;
  var nodes = [];

  // Charge function that is called for each node.
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  // Charge is negative because we want nodes to repel.
  // Dividing by 8 scales down the charge to be
  // appropriate for the visualization dimensions.
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength*1.4;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
      .velocityDecay(0.2)
      .force('x', d3.forceX().strength(forceStrength).x(center.x))
      .force('y', d3.forceY().strength(forceStrength).y(center.y))
      .force('charge', d3.forceManyBody().strength(charge))
      .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();


  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scalePow()
    .exponent(0.6)
    .range([1, 80]);

  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d) {
      var diff_lecture = d.allocated_lecture_h - d.planned_lecture_h;
      var diff_exercise = d.allocated_exercise_h - d.planned_exercise_h;
      var diff_lab = d.allocated_lab_h - d.planned_lab_h;
      var diff_assistance = d.allocated_assistance_h - d.planned_assistance_h;
      var diff_examination = d.allocated_examination_h - d.planned_examination_h;
      var diff_course_dev = d.allocated_course_dev_h - d.planned_course_dev_h;
      var diff_administration = d.allocated_administration_h - d.planned_administration_h;

      var bigArray = [diff_lecture, diff_exercise, diff_lab, diff_assistance, diff_examination, diff_course_dev, diff_administration];
      var positiveArray = [];
      var negativeArray = [];

      for (var i=0; i<bigArray.length;i++){
        if (bigArray[i]>=0){positiveArray.push(bigArray[i])}
        else {negativeArray.push(bigArray[i])};
      }

      var positiveValue = 0;
      var negativeValue = 0;

      for (var j=0; j<positiveArray.length;j++){
        positiveValue+=positiveArray[j];
      }

      for (var k=0; k<negativeArray.length;k++){
        negativeValue+=Math.abs(negativeArray[k]);
      }

      var radiusValue = positiveValue+negativeValue;
      return {
        radius: radiusScale(Math.abs(LimitRadius(radiusValue))),
        id: d.id,
        code: d.code,
        name: d.name,
        periods:d.periods,
        credits: d.credits,
        value: radiusValue,
        positiveValue: positiveValue,
        negativeValue: negativeValue,
        financial_outcome:d.financial_outcome,
        num_of_students:d.num_of_students,
        teachers:d.teachers,
        filterState:0,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    function LimitRadius(val){
      if (Math.abs(val) <1){
        return 5;
      }
      // else if (Math.abs(val)>150){
      //   return 80;
      // }
      else return (val);
    }

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number by converting it
    // with `+`.

    var maxAmount = d3.max(rawData, function (d) {
        var diff_lecture = d.allocated_lecture_h - d.planned_lecture_h;
        var diff_exercise = d.allocated_exercise_h - d.planned_exercise_h;
        var diff_lab = d.allocated_lab_h - d.planned_lab_h;
        var diff_assistance = d.allocated_assistance_h - d.planned_assistance_h;
        var diff_examination = d.allocated_examination_h - d.planned_examination_h;
        var diff_course_dev = d.allocated_course_dev_h - d.planned_course_dev_h;
        var diff_administration = d.allocated_administration_h - d.planned_administration_h;

        var radiusValue = Math.abs(diff_lecture);
        radiusValue+=Math.abs(diff_exercise);
        radiusValue+=Math.abs(diff_lab);
        radiusValue+=Math.abs(diff_assistance);
        radiusValue+=Math.abs(diff_examination);
        radiusValue+=Math.abs(diff_course_dev);
        radiusValue+=Math.abs(diff_administration);
        radiusValue = Math.round((radiusValue)*10)/10;
      return radiusValue});
    radiusScale.domain([0, maxAmount]);

    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('id', "coursesoverview_svgCoursesOverview")
      .attr("viewBox", '0 0 '+width+' '+height)

      svg.append('text')
          .attr('class', 'teachersoverview_title')
          .attr('x', width/2)
          .attr('y', "1.5em")
          .attr('text-anchor', 'middle')
          .attr("font-size", "2em")
          .attr("opacity", 0.5)
          .text("Planned hours vs allocated hours");

      var elem = svg.selectAll("g")
        .data(nodes, function (d) { return d.id; });
    var elemEnter = elem.enter()
        .append("g")
        .classed("bubbleGroup", true)
        .on('mouseover', showDetail)
        .on('mouseout', hideDetail);


    var arc = d3.arc().innerRadius(0).outerRadius(20);

    elemEnter.selectAll(".arc")
        .data(function(d){
          var pie = d3.pie()
              .value(function(d) {return d.value; })

          var data = null;

          if (d.positiveValue ===0 && d.negativeValue === 0){
            data = {positiveValue:1, negativeValue: 0};
          }

          if (d.positiveValue !==0 && d.negativeValue === 0){
            data = {positiveValue:d.positiveValue, negativeValue: 0};
          }

          if (d.positiveValue ===0 && d.negativeValue !== 0){
            data = {positiveValue:0, negativeValue: d.negativeValue};
          }

          if (d.positiveValue !==0 && d.negativeValue !== 0){
            data = {positiveValue:d.positiveValue, negativeValue: d.negativeValue};
          }
          // arc.outerRadius(d.positiveValue+d.negativeValue);
          return(pie(d3.entries(data)));
        })
        .enter()
        .append('path')
        .classed("bubble", true)
        .attr('d', function(d){
          d3.select(this.parentNode).each(function(d){
            arc.outerRadius(d.radius)
          });
          return arc(d);
          })
        .attr("fill", function(d){
          if (d.data.value===0){
            return "none";
          }
          else {
            if (d.data.key === "positiveValue"){
              if (d.data.value ===1){
                return "#5D41E6"
              }
              else return "#60B766";
            }
            else return "#DC2F2F";
          }
        })
        .attr("stroke", function(d){
          if (d.data.value===0){
            return "none";
          }
          else {
            if (d.data.key === "positiveValue"){
              if (d.data.value ===1){
                return "#332480"
              }
              else return "#386C3B";
            }
            else return "#801B1B";
          }
        })
        .attr("stroke-width", "2px")
        .on('click', function(){
          var donnee = 0
          d3.select(this.parentNode).each(function(d) {
            donnee = d;});
          selectCourseByClick(donnee, this);
        });


    bubbles = svg.selectAll('.bubble')
    //
    groups = svg.selectAll('.bubbleGroup');

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();

    d3.select("#coursesoverview_filterButton")
        .on('click',function(){
          var filterMenuDisplay = document.getElementById("coursesoverview_filterMenu").style;
          if (filterMenuDisplay.display !== "inline-block"){
            filterMenuDisplay.display="inline-block"

          }
          else filterMenuDisplay.display="none";
        });

    d3.select("#coursesoverview_eraseFilterButton")
        .on('click', function(){
          groupBubbles();
          document.getElementById("coursesoverview_filterMenu").style.display = "none";
          document.getElementById("coursesoverview_filterMinValue").value="";
          document.getElementById("coursesoverview_filterMaxValue").value="";

          var filterPositionElement = document.getElementById("coursesoverview_filterPeriodValue");
          filterPositionElement.selectedIndex = "0";
        });

    d3.select("#coursesoverview_confirmFilterButton")
        .on('click', function(){
          splitBubbles(rawData);
          document.getElementById("coursesoverview_filterMenu").style.display = "none";
        });

    d3.select("#coursesoverview_coursesSearchButton")
        .on('click',function(){
          selectCourseBySearch();
        })

    document.onclick = function(e) {
      if (e.target === document.getElementById("coursesoverview_svgCoursesOverview")){
        deselectCourse();
        document.getElementById("coursesoverview_legendMenu").style.display = "none";
        document.getElementById("coursesoverview_filterMenu").style.display = "none";
      }
      if (e.target === document.getElementById("coursesoverview_courseSearch")){
        document.getElementById("coursesoverview_legendMenu").style.display = "none";
        document.getElementById("coursesoverview_filterMenu").style.display = "none";
      }
      if (e.target === document.getElementById("coursesoverview_coursesSearchButton")){
        document.getElementById("coursesoverview_legendMenu").style.display = "none";
        document.getElementById("coursesoverview_filterMenu").style.display = "none";
      }
      if (e.target === document.getElementById("coursesoverview_legendButton")){
        document.getElementById("coursesoverview_filterMenu").style.display = "none";
      }
    }

      d3.select("#coursesoverview_courseSearch")
          .on('click',function(){
              document.getElementById("coursesoverview_courseSearch").value="";
          });

    createLegend();
    d3.select("#coursesoverview_legendButton")
        .on('click',function(){
          var legendMenuDisplay = document.getElementById("coursesoverview_legendMenu").style;
          if (legendMenuDisplay.display !== "inline-block"){
            legendMenuDisplay.display="inline-block"

          }
          else legendMenuDisplay.display="none";
        });

        autocomplete(document.getElementById("coursesoverview_courseSearch"), coursesNames);

  };

  function ticked() {
    groups
        .attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; })
  }

  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideFilter();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * splitCenter of their data's year.
   */
  function splitBubbles(data) {
    showFilterSplitTitles();

    var minValue = 0;

    var maxValue = d3.max(data, function (d) {
      var diff_lecture = d.allocated_lecture_h - d.planned_lecture_h;
      var diff_exercise = d.allocated_exercise_h - d.planned_exercise_h;
      var diff_lab = d.allocated_lab_h - d.planned_lab_h;
      var diff_assistance = d.allocated_assistance_h - d.planned_assistance_h;
      var diff_examination = d.allocated_examination_h - d.planned_examination_h;
      var diff_course_dev = d.allocated_course_dev_h - d.planned_course_dev_h;
      var diff_administration = d.allocated_administration_h - d.planned_administration_h;

      var radiusValue = Math.abs(diff_lecture);
      radiusValue+=Math.abs(diff_exercise);
      radiusValue+=Math.abs(diff_lab);
      radiusValue+=Math.abs(diff_assistance);
      radiusValue+=Math.abs(diff_examination);
      radiusValue+=Math.abs(diff_course_dev);
      radiusValue+=Math.abs(diff_administration);
      radiusValue = Math.round((radiusValue)*10)/10;
      return radiusValue});

    var minValElement = parseInt(document.getElementById("coursesoverview_filterMinValue").value);
    var maxValElement = parseInt(document.getElementById("coursesoverview_filterMaxValue").value);

    if (Number.isInteger(minValElement)){
      minValue = minValElement;
    }

    if (Number.isInteger(maxValElement)){
      maxValue = maxValElement;
    }

    var filterPeriodElement = document.getElementById("coursesoverview_filterPeriodValue");
    var periodValue = filterPeriodElement.options[filterPeriodElement.selectedIndex].value

    // @v4 Reset the 'y' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength).y(function(d){
      d.filterState = 0;

      if (d.value >= minValue && d.value <= maxValue) {
        if (periodValue === "choose") {
          d.filterState = 1;
        }

        for (var i=0;i<d.periods.length;i++){
          if (periodValue === d.periods[i].toString()) {
            d.filterState = 1;
          }
        }
      }
      else d.filterState = 0;

      return filterSplitCenters[d.filterState].y;
    }));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Hides Filter title displays.
   */
  function hideFilter() {
    svg.selectAll('.coursesoverview_split').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showFilterSplitTitles() {
    svg.append('text')
        .attr('class', 'coursesoverview_split')
        .attr('x', 60)
        .attr('y', function (d) { return filterSplitTitles["filtered"]; })
        .attr('text-anchor', 'middle')
        .text("Filtered");

    svg.append('text')
        .attr('class', 'coursesoverview_split')
        .attr('x', 60)
        .attr('y', function (d) { return filterSplitTitles["notFiltered"]; })
        .attr('text-anchor', 'middle')
        .text("Not filtered");
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.

      var arc = d3.arc().innerRadius(0)

      if(!d3.select(this).classed("coursesoverview_selected")){
          d3.select(this.childNodes[0])
              .attr('d', function(d){
                  d3.select(this.parentNode).each(function(d){
                      arc.outerRadius(d.radius+5)
                  });
                  return arc(d);
              })

          d3.select(this.childNodes[1])
              .attr('d', function(d){
                  d3.select(this.parentNode).each(function(d){
                      arc.outerRadius(d.radius+5)
                  });
                  return arc(d);
              })
      }

      var content = '<span class="name">Course: </span><span class="value">' +
                    "("+d.code + ") "+d.name+" ("+d.credits+" cdt)"+
                    '</span><br/>' +
                    '<span class="name">Periods: </span><span class="value">' +
                    coursePeriods(d.periods) +
                    '</span><br/>' +
                    '<span class="name">Nbr of students: </span><span class="value">' +
                    d.num_of_students +
                    '</span><br/>' +
                    '<span class="name">Surplus of hours allocated: </span><span class="value">' +
                    positiveVal(d.positiveValue) + " h" +
                    '</span><br/>' +
                    '<span class="name">Deficit of hours allocated: </span><span class="value">' +
                    positiveVal(d.negativeValue) + " h" +
                    '</span>';

      tooltip.showTooltip(content, d3.event);
  }

  /*
  verify if d.value is positive or negative. If it's positive, adds a "+" in front of this value
   */
  function positiveVal(value){
    if (value >0){return "+"+value}
    else return value;
  }

  /*
  Takes all the teachers of a course and returns a string of these teachers
   */
  function courseTeachers(teachersArray){
    var nbrTeachers=teachersArray.length;
    var texte="";
    for (var i=0;i<nbrTeachers;i++){
      texte+=teachersArray[i]["teacher_name"];
      if (i!==nbrTeachers-1){
        texte+=", "
      }
    }
    return texte;
  }

  /*
  Takes all the periods of a course and returns a string of these periods
   */
  function coursePeriods(periodsArray){
    var nbPeriods=periodsArray.length;
    var texte="";
    for (var i=0;i<nbPeriods;i++){
      texte+=periodsArray[i]
      if (i!==nbPeriods-1){
        texte+=", "
      }
    }
    return texte;
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    var arc = d3.arc().innerRadius(0)

    if(!d3.select(this).classed("coursesoverview_selected")){
      d3.select(this.childNodes[0])
          .attr('d', function(d){
            d3.select(this.parentNode).each(function(d){
              arc.outerRadius(d.radius)
            });
            return arc(d);
          })

      d3.select(this.childNodes[1])
          .attr('d', function(d){
            d3.select(this.parentNode).each(function(d){
              arc.outerRadius(d.radius)
            });
            return arc(d);
          })

    }

    tooltip.hideTooltip();
  }

  /*
  Deselect a teacher when we click on a bubble
   */
  function deselectCourse(path) {
    //Unselect previous teacher

    propfunction(null);
    
    var arc = d3.arc().innerRadius(0)

    var selectedBubble =d3.select(".coursesoverview_selected")

    if (selectedBubble["_groups"][0][0]!==null){
      d3.select(selectedBubble["_groups"][0][0].childNodes[0])
          .attr('d', function(d){
            d3.select(selectedBubble["_groups"][0][0]).each(function(d){
              arc.outerRadius(d.radius)
            });
            return arc(d);
          })

      d3.select(selectedBubble["_groups"][0][0].childNodes[1])
          .attr('d', function(d){
            d3.select(selectedBubble["_groups"][0][0]).each(function(d){
              arc.outerRadius(d.radius)
            });
            return arc(d);
          })
    }

    selectedBubble =d3.select(".coursesoverview_selected")
        .classed("coursesoverview_selected", false)

    d3.selectAll(".coursesoverview_selectText")
        .classed("coursesoverview_selectText", false)
        .remove();
  }


  /*
  Select a teacher when we click on a bubble
   */
  function selectCourseByClick(d, path){
    deselectCourse(path);
    //Select the new teacher for new circle style


    d3.select(path.parentNode)
        .classed("coursesoverview_selected", true);


    var arc = d3.arc().innerRadius(80).outerRadius(100);

    d3.select(path.parentNode.childNodes[0])
        .attr('d', arc)

    d3.select(path.parentNode.childNodes[1])
        .attr('d', arc)

    //Put the circle at the front
    d3.select(svg).each(function(){path.parentNode.parentNode.appendChild(path.parentNode)});

    //Add the text to the circle
    var radius = 100;
    var side = 1.5 * radius * Math.cos(Math.PI / 4);
    var dx = -side/2;

    var circle = d3.select(path.parentNode).append('circle')
        .attr('r', 80)
        .attr('fill', d => d.positiveValue - d.negativeValue === 0 ? '#5D41E6' : (d.positiveValue - d.negativeValue < 0 ? '#DC2F2F' : '#60B766'))
        .classed("coursesoverview_selectText", "true")


    var g = d3.select(path.parentNode).append('g')
        .attr('transform', 'translate(' + [dx, dx+20] + ')')
        .classed("coursesoverview_selectText", "true")

    g.append("foreignObject")
        .attr("width", side)
        .attr("height", side)
        .append("xhtml:body")
        .attr("id", "selectTextBody")
        .style('text-align', 'center')
        .style('color', 'white')
        .style('background-color', d => d.positiveValue - d.negativeValue === 0 ? '#5D41E6' : (d.positiveValue - d.negativeValue < 0 ? '#DC2F2F' : '#60B766'))
        .html(function(d){
          propfunction(d.id);
          var text = "<p style='margin: 0'>" +"<b>"+d.code + "</b>";
          text+= "<p style='margin: 0'>" +d.name;
          text+="<p style='margin-top:20px'>"+ d.value + "h";
          return text;
        });

  }

  /*
    Select a teacher when we search for him
     */
  function selectCourseBySearch(){

    //Deselect the teachers previously selected
    deselectCourse();

    // take the searched value
    var selectedCourse = findCourseCircle();

    var arc = d3.arc().innerRadius(80).outerRadius(100);

    if (selectedCourse !== null) {
      
      d3.select(selectedCourse.childNodes[0])
      .attr('d', arc)

      d3.select(selectedCourse.childNodes[1])
      .attr('d', arc)

    
      d3.select(selectedCourse)
          .classed("coursesoverview_selected", true);

      //Put the circle at the front

        d3.select(svg).each(function(){selectedCourse.parentNode.appendChild(selectedCourse)});


      //Add the text to the circle
      var radius = 100;
      var side = 1.5 * radius * Math.cos(Math.PI / 4);
      var dx = -side/2;

      var circle = d3.select(selectedCourse).append('circle')
            .attr('r', 80)
            .attr('fill', d => d.positiveValue - d.negativeValue === 0 ? '#5D41E6' : (d.positiveValue - d.negativeValue < 0 ? '#DC2F2F' : '#60B766'))
            .classed("coursesoverview_selectText", "true");

       var g = d3.select(selectedCourse).append('g')
          .attr('transform', 'translate(' + [dx, dx+20] + ')')
          .classed("coursesoverview_selectText", "true")

      g.append("foreignObject")
          .attr("width", side)
          .attr("height", side)
          .append("xhtml:body")
          .attr("id", "selectTextBody")
          .style('text-align', 'center')
          .style('color', 'white')
          .style('background-color', d => d.positiveValue - d.negativeValue === 0 ? '#5D41E6' : (d.positiveValue - d.negativeValue < 0 ? '#DC2F2F' : '#60B766'))
          .html(function(d){
            propfunction(d.id);
            var text = "<p style='margin: 0'>" +"<b>"+d.code + "</b>";
            text+= "<p style='margin: 0'>" +d.name;
            text+="<p style='margin-top:20px'>"+ d.value + "h";
            return text;
          });
    }
  }

  /*
  Help function to find the circle associated with a name
   */
  function findCourseCircle(){
    var searchVal = document.getElementById("coursesoverview_courseSearch").value;

    var circle = null;

    svg.selectAll('.bubbleGroup').each(function(d){
      if (d.code === searchVal){
        circle = this;
      }
    })
    return (circle);
  }


  function createLegend(){
    var menuSvg = d3.select("#coursesoverview_legendMenu")
        .append('svg')
        .attr('id', "coursesoverview_legendMenuSvg")
        .attr('height', "16em")
        .attr('width', "28em");

    menuSvg.append('circle')
        .attr('r',"1.3em")
        .attr('fill', "#5D41E6")
        .attr('stroke', "#332480")
        .attr('stroke-width', "0.15em")
        .attr('cx',40)
        .attr('cy',40);

    menuSvg.append('text')
        .attr("x", 80)
        .attr("y", 43)
        .text("Planned hours = allocated hours")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.9em")
        .attr("fill", "black");

    menuSvg.append('circle')
        .attr('r',"1.3em")
        .attr('fill', "#DC2F2F")
        .attr('stroke', "#801B1B")
        .attr('stroke-width', "0.15em")
        .attr('cx',40)
        .attr('cy',100);

    menuSvg.append('text')
        .attr("x", 80)
        .attr("y", 103)
        .text("Need to allocate hours in some parts of the course")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.9em")
        .attr("fill", "black");

      menuSvg.append('circle')
          .attr('r',"1.3em")
          .attr('fill', "#60B766")
          .attr('stroke', "#386C3B")
          .attr('stroke-width', "0.15em")
          .attr('cx',40)
          .attr('cy',160);

      menuSvg.append('text')
          .attr("x", 80)
          .attr("y", 163)
          .text("Too much allocated hours in some parts of the course")
          .attr("font-family", "sans-serif")
          .attr("font-size", "0.9em")
          .attr("fill", "black");

    var sizeCircle= menuSvg.append('g')

    sizeCircle.append('circle')
        .attr('r',"1.4em")
        .attr('fill', "white")
        .attr('stroke', "grey")
        .attr('stroke-width', "0.1em")
        .attr('cx', 40)
        .attr('cy',220);

    sizeCircle.append('text')
        .attr("x", 27)
        .attr("y", 223)
        .text("size")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.9em")
        .attr("fill", "black");

    menuSvg.append('text')
        .attr("x", 80)
        .attr("y", 223)
        .text("Size of the anomaly")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.9em")
        .attr("fill", "black");


    // #60B766
    // #DC2F2F
    // #5D41E6
    //
    // #386C3B
    // #801B1B
    // #332480
  }

  function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            selectCourseBySearch();
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        selectCourseBySearch();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  // return the chart function from closure.
  return chart;
}

  floatingTooltip(tooltipId, width) {
    // Local variable to hold tooltip div for
    // manipulation in other functions.
    var tt = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', tooltipId)
        .style('pointer-events', 'none');
  
    // Set a width if it is provided.
    if (width) {
      tt.style('width', width);
    }
  
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

  coursesNames(data){
    var names = [];
  
    for (var i=0; i<data.length; i++){
      names.push(data[i]["code"]);
    }
    return names;
  }

  render() {
    return (
      <div className="coursesoverview">
        <div className="containerOverviews">
            <div id="coursesoverview_toolbar">
              <div id="coursesoverview_filter">
              <div id="coursesoverview_filterButton" className = "button toolbarElement"> Filter
              </div>
              <div id="coursesoverview_filterMenu">
                  <div>
                      <p className="filterElement firstElement">Filter by anomaly value</p>
                      <input id="coursesoverview_filterMinValue" className="filterElement" type="text" name="minValue" placeholder = "min value"></input>
                      <input id="coursesoverview_filterMaxValue" className="filterElement" type="text" name="maxValue" placeholder = "max value"></input>
                  </div>
                  <div>
                      <p className="filterElement firstElement">Filter by period</p>
                      <select id="coursesoverview_filterPeriodValue" className="filterElement" name="departments">
                          <option value="choose">Choose a period</option>
                          <option value="1">Period 1</option>
                          <option value="2">Period 2</option>
                          <option value="3">Period 3</option>
                          <option value="4">Period 4</option>
                      </select>
                  </div>
                  <div>
                      <div id="coursesoverview_eraseFilterButton" className="filterElement firstElement">Erase Filter</div>
                      <div id="coursesoverview_confirmFilterButton" className="filterElement">Ok</div>
                  </div>
              </div>
              </div>
            <form>
              <div className="autocomplete toolbarElement" style={{width: "50%", minWidth: "200px"}}>
                <input id="coursesoverview_courseSearch" className="toolbarElement" type="text" name="myCourse" placeholder="Search for a course here"></input>
              </div>
              <div id="coursesoverview_coursesSearchButton" className = "button toolbarElement"> Search </div>
            </form>
              <div id ="coursesoverview_legend">
              <div id="coursesoverview_legendButton" className="button toolbarElement">
                  Legend
              </div>
              <div id="coursesoverview_legendMenu">
              </div>
              </div>
          </div>
          <div id="coursesoverview_vis"></div>

        </div>
      </div>
    );
  }

}

export default CoursesOverview;