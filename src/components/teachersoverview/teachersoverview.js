import React, { Component } from 'react';
import './teachersoverview.css';
import './auto_complete.css';
import * as d3 from "d3";

class TeachersOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers_data: require('../../data/Teachers.json'),
      active_teacher: this.props.active_teacher
    }
  }

  componentDidMount() {
    let myBubbleChart = this.bubbleChart(2);
    myBubbleChart('#teachersoverview_vis', this.state.teachers_data);
    //this.autocomplete(document.getElementById("teachersoverview_teacherSearch"), this.teachersNames(this.state.teachers_data));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_teacher !== prevState.active_teacher) {
      this.setState({ active_teacher: this.props.active_teacher });
      //d3.select("#teachersoverview_vis").selectAll("*").remove();
      //let myBubbleChart = this.bubbleChart();
      //myBubbleChart('#teachersoverview_vis', this.state.teachers_data);
    }
  }

  bubbleChart(teacherIdd) {
    var propfunction = this.props.teacherIdUpdate;
    var teacherId = this.state.active_teacher;
    const rawData = this.state.teachers_data;
    let teachersNames = this.teachersNames(rawData);
    let coursesCodes = this.coursesCodes(rawData);
    // Constants for sizing
    var width = 800;
    var height = 730;


    // tooltip for mouseover functionalityc
    var tooltip = this.floatingTooltip('teachersoverview_gates_tooltip', 30);
  
    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    var center = { x: width / 2, y: height / 2 };

    console.log(center);


    var filterSplitCenters = {
      1: { x: width / 2, y: height / 2.4 },
      0: { x: width / 2, y: 2*height / 3 }
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
        .range([1, 100]);
  
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
        var gru_balance_20 = Math.round((d.gru_balance_19 + d.gru_vt + d.gru_ht + d.self_dev + d.extra - d.kontering)*10)/10;
        return {
          id: d.id,
          radius: radiusScale(Math.abs(LimitRadius(+gru_balance_20))),
          value: gru_balance_20,
          name: d.name,
          filterState: 0,
          position: d.position,
          department: d.dept,
          vt_courses: d.vt_courses,
          ht_courses: d.ht_courses,
          x: Math.random() * 900,
          y: Math.random() * 800
        };
      });
  
      function LimitRadius(val){
        if (Math.abs(val) <1){
          return 1;
        }
        else if (Math.abs(val)>80){
          return 80;
        }
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
        var gru_balance_20 = d.gru_balance_19 + d.gru_vt + d.gru_ht + d.self_dev + d.extra - d.kontering;
        return gru_balance_20; });
      radiusScale.domain([0, maxAmount]);
  
      nodes = createNodes(rawData);
  
      // Create a SVG element inside the provided selector
      // with desired size.
      svg = d3.select(selector)
          .append('svg')
          .attr('id', "teachersoverview_svgTeachersOverview")
          .attr("viewBox", '0 0 '+width+' '+height)

      svg.append('text')
          .attr('class', 'teachersoverview_title')
          .attr('x', width/2)
          .attr('y', "1.50" +
              "2em")
          .attr('text-anchor', 'middle')
          .attr("font-size", "2em")
          .attr("opacity", 0.5)
          .text("Hours assigned vs Year's goal");
  
      var elem = svg.selectAll("g")
          .data(nodes, function (d) { return d.id; });
      var elemEnter = elem.enter()
          .append("g")
  
      // Create new circle elements each with class `bubble`.
      // Bind nodes data to what will become DOM elements to represent them.
      // There will be one circle.bubble for each object in the nodes array.
      // Initially, their radius (r attribute) will be 0.
      elemEnter.append('circle')
          .classed('teachersoverview_bubble', true)
          .attr('r', 0)
          .data(nodes, function (d) { return d.id; })
          .attr('fill', function(d){
            if (d.value>5){return '#60B766'}
            else if (d.value<-5){return "#DC2F2F"}
            else return '#5D41E6';
          })
          .attr('stroke', function(d){
            if (d.value>5){return '#386C3B'}
            else if (d.value<-5){return "#801B1B"}
            else return '#332480';
          })
          .attr('stroke-width', 2)
          .on('mouseover', showDetail)
          .on('mouseout', hideDetail)
          .on('click', selectTeacherByClick);
  
      bubbles = svg.selectAll('.teachersoverview_bubble')
  
      groups = svg.selectAll('g');
  
      // Fancy transition to make bubbles appear, ending with the
      // correct radius
      bubbles.transition()
          .duration(2000)
          .attr('r', function (d) { return d.radius; });
  
      // Set the simulation's nodes to our newly created nodes array.
      // @v4 Once we set the nodes, the simulation will start running automatically!
      simulation.nodes(nodes);
  
      // Set initial layout to single group.
      groupBubbles();
  
      d3.select("#teachersoverview_filterButton")
          .on('click',function(){
            var filterMenuDisplay = document.getElementById("teachersoverview_filterMenu").style;
            if (filterMenuDisplay.display !== "inline-block"){
              filterMenuDisplay.display="inline-block"
  
            }
            else filterMenuDisplay.display="none";
          });
  
      d3.select("#teachersoverview_eraseFilterButton")
          .on('click', function(){
            groupBubbles();
            document.getElementById("teachersoverview_filterMenu").style.display = "none";
            document.getElementById("teachersoverview_filterMinValue").value="";
            document.getElementById("teachersoverview_filterMaxValue").value="";
            document.getElementById("teachersoverview_filterCourseValue").value="";
  
  
            var filterPositionElement = document.getElementById("teachersoverview_filterPositionValue");
            filterPositionElement.selectedIndex = "0";
  
            var filterDepartmentElement = document.getElementById("teachersoverview_filterDepartmentValue");
            filterDepartmentElement.selectedIndex = "0";
  
          });
  
      d3.select("#teachersoverview_confirmFilterButton")
          .on('click', function(){
            splitBubbles(rawData);
            document.getElementById("teachersoverview_filterMenu").style.display = "none";
          });
  
      d3.select('#teachersoverview_teacherSearchButton')
          .on('click', function(){
            selectTeacherBySearch();
          })
  
      document.onclick = function(e) {
        console.log(e.x);
        if (e.target === document.getElementById("teachersoverview_svgTeachersOverview")){
          deselectTeacher();
          document.getElementById("teachersoverview_legendMenu").style.display = "none";
          document.getElementById("teachersoverview_filterMenu").style.display = "none";
        }
        if (e.target === document.getElementById("teachersoverview_teacherSearch")){
          document.getElementById("teachersoverview_legendMenu").style.display = "none";
          document.getElementById("teachersoverview_filterMenu").style.display = "none";
        }
        if (e.target === document.getElementById("teachersoverview_teacherSearchButton")){
          document.getElementById("teachersoverview_legendMenu").style.display = "none";
          document.getElementById("teachersoverview_filterMenu").style.display = "none";
        }
  
        if (e.target === document.getElementById("teachersoverview_legendButton")){
          document.getElementById("teachersoverview_filterMenu").style.display = "none";
        }
      }
  
      createLegend();
      d3.select("#teachersoverview_legendButton")
          .on('click',function(){
            var legendMenuDisplay = document.getElementById("teachersoverview_legendMenu").style;
            if (legendMenuDisplay.display !== "inline-block"){
              legendMenuDisplay.display="inline-block"
  
            }
            else legendMenuDisplay.display="none";
          });
  
      d3.select("#teachersoverview_teacherSearch")
          .on('click',function(){
            document.getElementById("teachersoverview_teacherSearch").value="";
          });
  
      autocomplete(document.getElementById("teachersoverview_teacherSearch"), teachersNames);
      autocomplete(document.getElementById("teachersoverview_filterCourseValue"), coursesCodes);

      if (teacherIdd){
        selectTeacherById(teacherIdd)
      }

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
  
      var minValue = d3.min(data, function (d) {
        var gru_balance_20 = Math.round((d.gru_balance_19 + d.gru_vt + d.gru_ht + d.self_dev + d.extra - d.kontering)*10)/10;
        return gru_balance_20; });
  
      var maxValue = d3.max(data, function (d) {
        var gru_balance_20 = Math.round((d.gru_balance_19 + d.gru_vt + d.gru_ht + d.self_dev + d.extra - d.kontering)*10)/10;
        return gru_balance_20; });
  
      var minValElement = parseInt(document.getElementById("teachersoverview_filterMinValue").value);
      var maxValElement = parseInt(document.getElementById("teachersoverview_filterMaxValue").value);
  
      if (Number.isInteger(minValElement)){
        minValue = minValElement;
      }
  
      if (Number.isInteger(maxValElement)){
        maxValue = maxValElement;
      }
  
      var filterPositionElement = document.getElementById("teachersoverview_filterPositionValue");
      var positionValue = filterPositionElement.options[filterPositionElement.selectedIndex].value
  
      var filterDepartmentElement = document.getElementById("teachersoverview_filterDepartmentValue");
      var departmentValue = filterDepartmentElement.options[filterDepartmentElement.selectedIndex].value
  
      var chosenCourse= document.getElementById("teachersoverview_filterCourseValue").value;
  
      // @v4 Reset the 'y' force to draw the bubbles to their year centers
      simulation.force('y', d3.forceY().strength(forceStrength).y(function(d){
        d.filterState = 0;
  
        if (d.value >= minValue && d.value <= maxValue) {
  
          if (positionValue === "choose" && departmentValue === "choose" && chosenCourse === "") {
            d.filterState = 1;
          }
  
          if (d.position === positionValue && departmentValue === "choose" && chosenCourse === "") {
            d.filterState = 1;
          }
  
          if (positionValue === "choose" && d.department === departmentValue && chosenCourse === "") {
            d.filterState = 1;
          }
  
          if (positionValue === "choose" && departmentValue === "choose" && isInCourses(d, chosenCourse)) {
            d.filterState = 1;
          }
  
          if (d.position === positionValue && d.department === departmentValue && chosenCourse === "") {
            d.filterState = 1;
          }
  
          if (d.position === positionValue && departmentValue === "choose" && isInCourses(d, chosenCourse)) {
            d.filterState = 1;
          }
  
          if (positionValue === "choose"  && d.department === departmentValue && isInCourses(d, chosenCourse)) {
            d.filterState = 1;
          }
  
          if (d.position === positionValue && d.department === departmentValue && isInCourses(d, chosenCourse)) {
            d.filterState = 1;
          }
  
        }
  
        else d.filterState = 0;
        return filterSplitCenters[d.filterState].y;
      }));
  
      /*
      function to know if a course is in the courses of a teacher
       */
      function isInCourses(d, chosenCourse){
        if (d.vt_courses.length!==0){
          for (var i=0; i<d.vt_courses.length;i++){
            if (d.vt_courses[i]["course_code"]===chosenCourse){
              return true
            }
          }
        }
  
        if (d.ht_courses.length!==0){
          for (var t=0; t<d.ht_courses.length;t++){
            if (d.ht_courses[t]["course_code"]===chosenCourse){
              return true
            }
          }
        }
  
        return false;
      }
  
      // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(1).restart();
    }
  
  
    /*
     * Hides Filter title displays.
     */
    function hideFilter() {
      svg.selectAll('.teachersoverview_split').remove();
    }
  
    /*
     * Shows Year title displays.
     */
    function showFilterSplitTitles() {
      svg.append('text')
          .attr('class', 'teachersoverview_split')
          .attr('x', 60)
          .attr('y', function (d) { return filterSplitTitles["filtered"]; })
          .attr('text-anchor', 'middle')
          .text("Filtered");
  
      svg.append('text')
          .attr('class', 'teachersoverview_split')
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
      d3.select(this).attr('r', function(d){return d.radius+5});
  
      var content = '<span class="name">Title: </span><span class="value">' +
          d.name +
          '</span><br/>' +
          '<span class="name">Position: </span><span class="value">' +
          positiveVal(d.position) +
          '</span><br/>' +
          '<span class="name">Department: </span><span class="value">' +
          positiveVal(d.department) +
          '</span><br/>' +
          '<span class="name">Hours assigned: </span><span class="value">' +
          positiveVal(d.value) + '%'+
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
     * Hides tooltip
     */
    function hideDetail(d) {
      // reset outline
      d3.select(this).attr('r', function(d){return d.radius});
  
  
      tooltip.hideTooltip();
    }
  
    /*
    Deselect a teacher when we click on a bubble
     */
    function deselectTeacher() {
      //Unselect previous teacher
      propfunction(null);
  
      d3.select(".teachersoverview_selected")
          .classed("teachersoverview_selected", false);
  
      d3.selectAll(".teachersoverview_selectText")
          .classed("teachersoverview_selectText", false)
          .remove();
    }
  
  
    /*
    Select a teacher when we click on a bubble
     */
    function selectTeacherByClick(){
      deselectTeacher();
      //Select the new teacher for new circle style
  
      d3.select(this)
          .classed("teachersoverview_selected", true);
  
      //Put the circle at the front
      d3.select(this.parentNode).each(function(){this.parentNode.appendChild(this)});
  
      //Add the text to the circle
      var radius = 80;
      var side = 2 * radius * Math.cos(Math.PI / 4);
      var dx = -side/2;
  
      var g = d3.select(this.parentNode).append('g')
          .attr('transform', 'translate(' + [dx, dx+10] + ')')
          .classed("teachersoverview_selectText", "true")
  
      g.append("foreignObject")
          .attr("width", side)
          .attr("height", side)
          .append("xhtml:body")
          .attr("id", "selectTextBody")
          .style('text-align', 'center')
          .style('color', 'white')
          .style('background-color', d => d.value > 5 ? '#60B766' : (d.value < -5 ? '#DC2F2F' : '#5D41E6'))
          .html(function(d){
            propfunction(d.id);
            var text = "<p style='margin: 0'>" + d.name + "<p style='margin-top:10px'>"+ d.value + "%";
            return text;
          });
  
    }
  
    /*
      Select a teacher when we search for him
       */
    function selectTeacherBySearch(){
  
      //Deselect the teachers previously selected
      deselectTeacher();
  
      // take the searched value
      var selectedTeacher = findTeacherCircle();
  
  
      if (selectedTeacher !== null){
        d3.select(selectedTeacher)
            .classed("teachersoverview_selected", true);
  
        //Put the circle at the front
  
        d3.select(selectedTeacher.parentNode).each(function(){this.parentNode.appendChild(this)});
  
  
        //Add the text to the circle
        var radius = 80;
        var side = 2 * radius * Math.cos(Math.PI / 4);
        var dx = -side/2;
  
        var g = d3.select(selectedTeacher.parentNode).append('g')
            .attr('transform', 'translate(' + [dx, dx] + ')')
            .classed("teachersoverview_selectText", "true")
  
        g.append("foreignObject")
            .attr("width", side)
            .attr("height", side)
            .append("xhtml:body")
            .attr("id", "selectTextBody")
            .style('text-align', 'center')
            .style('color', 'white')
            .style('background-color', d => d.value > 5 ? '#60B766' : (d.value < -5 ? '#DC2F2F' : '#5D41E6'))
            .html(function(d){
              propfunction(d.id);
              var text = "<p style='margin: 0'>" + d.name + "<p style='margin-top:10px'>"+ d.value + "%";
              return text;
            });
      }
    }

    /*
      Select a teacher when we search for him
       */
    function selectTeacherById(teacherId){

      //Deselect the teachers previously selected
      deselectTeacher();

      // take the searched value
      var selectedTeacher = findTeacherCircleById(teacherId);


      if (selectedTeacher !== null){
        d3.select(selectedTeacher)
            .classed("teachersoverview_selected", true);

        //Put the circle at the front

        d3.select(selectedTeacher.parentNode).each(function(){this.parentNode.appendChild(this)});


        //Add the text to the circle
        var radius = 80;
        var side = 2 * radius * Math.cos(Math.PI / 4);
        var dx = -side/2;

        var g = d3.select(selectedTeacher.parentNode).append('g')
            .attr('transform', 'translate(' + [dx, dx] + ')')
            .classed("teachersoverview_selectText", "true")

        g.append("foreignObject")
            .attr("width", side)
            .attr("height", side)
            .append("xhtml:body")
            .attr("id", "selectTextBody")
            .style('text-align', 'center')
            .style('color', 'white')
            .style('background-color', d => d.value > 5 ? '#60B766' : (d.value < -5 ? '#DC2F2F' : '#5D41E6'))
            .html(function(d){
              propfunction(d.id);
              var text = "<p style='margin: 0'>" + d.name + "<p style='margin-top:10px'>"+ d.value + "%";
              return text;
            });
      }
    }



    /*
    Help function to find the circle associated with a name
     */
    function findTeacherCircle(){
      var searchVal = document.getElementById("teachersoverview_teacherSearch").value;
  
      var circle = null;
  
      svg.selectAll('.teachersoverview_bubble').each(function(d){
        if (d.name === searchVal){
          circle = this;
        }
      })
  
      return (circle);
    }

    /*
    find teacher circle associated with id
     */
    function findTeacherCircleById(teacherId){
      var circle=null;

      svg.selectAll('.teachersoverview_bubble').each(function(d){
        if (d.id === teacherId){
          circle = this;
        }
      })

      return (circle);
    }

    function createLegend(){
      var menuSvg = d3.select("#teachersoverview_legendMenu")
          .append('svg')
          .attr('id', "teachersoverview_legendMenuSvg")
          .attr('height', "16em")

      menuSvg.append('circle')
          .attr('r',"1.3em")
          .attr('fill', "#60B766")
          .attr('stroke', "#386C3B")
          .attr('stroke-width', "0.15em")
          .attr('cx',40)
          .attr('cy',40);
  
      menuSvg.append('text')
          .attr("x", 80)
          .attr("y", 43)
          .text("Assigned hours  >  Year's goal")
          .attr("font-family", "sans-serif")
          .attr("font-size", "0.9em")
          .attr("fill", "black");
  
      menuSvg.append('circle')
          .attr('r',"1.3em")
          .attr('fill', "#5D41E6")
          .attr('stroke', "#332480")
          .attr('stroke-width', "0.15em")
          .attr('cx',40)
          .attr('cy',100);
  
      menuSvg.append('text')
          .attr("x", 80)
          .attr("y", 103)
          .text("Assigned hours  ~  Year's goal")
          .attr("font-family", "sans-serif")
          .attr("font-size", "0.9em")
          .attr("fill", "black");
  
      menuSvg.append('circle')
          .attr('r',"1.3em")
          .attr('fill', "#DC2F2F")
          .attr('stroke', "#801B1B")
          .attr("font-size", "0.9em")
          .attr('cx',40)
          .attr('cy',160);
  
      menuSvg.append('text')
          .attr("x", 80)
          .attr("y", 163)
          .text("Assigned hours  <  Year's goal")
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
          .text("Magnitude of the difference")
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
              selectTeacherBySearch();
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

  teachersNames(data){
    var names = [];
  
    for (var i=0; i<data.length; i++){
      names.push(data[i]["name"]);
    }
    return names;
  }

  coursesCodes(data){
    var names = [];
  
  
    for (var i=0; i<data.length; i++){
  
      for (var j=0; j<data[i]['vt_courses'].length;j++){
        names.push(data[i]['vt_courses'][j]["course_code"]);
      }
      for (var k=0; k<data[i]['ht_courses'].length;k++){
        names.push(data[i]['ht_courses'][k]["course_code"]);
      }
  
    }
  
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
  
  
    return names.filter(onlyUnique);
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

  render() {
    return (
      <div className="teachersoverview">
        <div className="containerOverviews">
          <div id="teachersoverview_toolbar">
              <div id = "teachersoverview_filter">
              <div id="teachersoverview_filterButton" className = "button toolbarElement"> Filter
              </div>
              <div id="teachersoverview_filterMenu">
                  <div>
                      <p className="filterElement firstElement">Filter by hours assigned value</p>
                      <input id="teachersoverview_filterMinValue" className="filterElement" type="text" name="minValue" placeholder = "min value"></input>
                      <input id="teachersoverview_filterMaxValue" className="filterElement" type="text" name="maxValue" placeholder = "max value"></input>
                  </div>
                  <div>
                      <p className="filterElement firstElement">Filter by position</p>
                      <select id="teachersoverview_filterPositionValue" className="filterElement" name="positions">
                          <option value="choose">Choose a position</option>
                          <option value="Professor">Professor</option>
                          <option value="Lektor">Lektor</option>
                          <option value="Doktorand">Doktorand</option>
                          <option value="Postdoc">Postdoc</option>
                          <option value="Adjunkt">Adjunkt</option>
                          <option value="bitr lektor">Bitr Lektor</option>
                          <option value="External">External</option>
                      </select>
                  </div>
                  <div>
                      <p className="filterElement firstElement">Filter by department</p>
                      <select id="teachersoverview_filterDepartmentValue" className="filterElement" name="departments">
                          <option value="choose">Choose a department</option>
                          <option value="MID">MID</option>
                          <option value="TMH">TMH</option>
                          <option value="CST">CST</option>
                          <option value="External">External</option>
                      </select>
                  </div>
                  <div>
                      <p className="filterElement firstElement">Filter by belonging to a course</p>

                      <form  className="filterElement">
                          <div className=" filterElement autocomplete" style={{padding: "0"}}>
                              <input id="teachersoverview_filterCourseValue" className="filterElement" type="text" name="myCourse" placeholder="Course"></input>
                          </div>
                      </form>
                  </div>
                  <div>
                      <div id="teachersoverview_eraseFilterButton" className="filterElement firstElement">Erase Filter</div>
                      <div id="teachersoverview_confirmFilterButton" className="filterElement">Ok</div>
                  </div>
              </div>
              </div>
              <form>
                  <div className="autocomplete toolbarElement" style={{width: "50%", minWidth: "200px"}}>
                      <input id="teachersoverview_teacherSearch" className="toolbarElement" type="text" name="myTeacher" placeholder="Search for a teacher here"></input>
                  </div>
                  <div id="teachersoverview_teacherSearchButton" className = "button toolbarElement"> Search </div>
              </form>
              <div id="teachersoverview_legend">
              <div id="teachersoverview_legendButton" className="button toolbarElement">
                  Legend
              </div>
              <div id="teachersoverview_legendMenu">
              </div>
              </div>
          </div>
          {/*<div className="teachersoverview_title"><h1>Hours assigned vs Year's goal</h1></div>*/}

          <div id="teachersoverview_vis"></div>


        </div>
      </div>
    );
  }

}

export default TeachersOverview;