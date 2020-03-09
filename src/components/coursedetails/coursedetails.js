import React, { Component } from 'react';
import './coursedetails.css';
import * as d3 from "d3";

class CourseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses_data: require('../../data/Courses.json'),
      active_course: this.props.active_course,
      active_teacher: this.props.active_teacher
    }
  }

  componentDidMount() {
    if(this.state.active_course !== null) {
      this.drawStackedBarCharts();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_course !== prevState.active_course) {
      console.log("Trigger1");
      this.setState({ active_course: this.props.active_course });
      if(this.state.active_course !== null) {
        d3.select("#my_dataviz").selectAll("*").remove();
        d3.select("#course_info").selectAll("*").remove();
        this.drawStackedBarCharts();
      }
    }
    if (this.props.active_teacher !== prevState.active_teacher) {
      console.log("Trigger2");
      this.setState({ active_teacher: this.props.active_teacher });
      if(this.state.active_course !== null) {
        d3.select("#my_dataviz").selectAll("*").remove();
        d3.select("#course_info").selectAll("*").remove();
        this.drawStackedBarCharts();
      }
    }
  }

  drawStackedBarCharts() {
    var propfunction = this.props.teacherIdUpdate;
    var active_teacher = this.state.active_teacher;
    var clickFromOutside = this.props.teacherClick;

    var id = this.state.active_course;
    //data structure
    var list = {
          frl: 0,   //lecture
          ovn: 0, //exercise
          la:0,  //Labs
          ha: 0, //assistance
          ex:0,  //examination
          ku:0, //course_dev
          adm:0, //administration
          name : ""
    };

    var list_s = {
      frl: 0,   //lecture
      ovn: 0, //exercise
      la:0,  //Labs
      ha: 0, //assistance
      ex:0,  //examination
      ku:0, //course_dev
      adm:0, //administration
      name : ""
    };
    var extra = [];

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 20, left: 30},
      width = 700 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    //set y axis
    var y_height;

    //details
    var svg_course = d3.select("#my_dataviz")
    .append("svg")
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", 80)
    .attr("viewBox", [0,0,width+margin.left+margin.right, 80])
    .append("g")
    .attr("transform",
            "translate(" + 0 + "," + 10 + ")");

    //black lines
    svg_course.append("line")
    .attr("x1", 40)
    .attr("y1", 0)
    .attr("x2", 700)
    .attr("y2", 0)
    .attr("stroke", "black")
    .attr("stroke-width", "2px");

    svg_course.append("line")
    .attr("x1", 40)
    .attr("y1", 65)
    .attr("x2", 700)
    .attr("y2", 65)
    .attr("stroke", "black")
    .attr("stroke-width", "2px");

    svg_course.append("line")
    .attr("x1", 40)
    .attr("y1", 0)
    .attr("x2", 40)
    .attr("y2", 65)
    .attr("stroke", "black")
    .attr("stroke-width", "2px");

    svg_course.append("line")
    .attr("x1", 700)
    .attr("y1", 0)
    .attr("x2", 700)
    .attr("y2", 65)
    .attr("stroke", "black")
    .attr("stroke-width", "2px");
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
    .append("svg")
      //.attr("width", width + margin.left + margin.right)
      //.attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", [0,0,width + margin.left + margin.right, height + margin.top + margin.bottom])
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
            
    var data = this.state.courses_data;
    var data_course = data.filter(data1=> data1.id == id)[0]
    var data_t = data_course.teachers;
    var hours = [];
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var group = ['administration','assistance','course_dev','examination','exercise','lab','lecture']
    var groups = ['adm','ha','ku','ex','ovn','la','frl']
    var group_reflect = {
      adm :'administration',
      ha:'assistance',
      ku:'course_dev',
      ex:'examination',
      ovn:'exercise',
      la:'lab',
      frl:'lecture'
    }
    //calculate list2
    groups.map(group=>{
      var list2 = {
        type: "",
        hours:0
      }
      var allocate = "allocated_" + group_reflect[group] + "_h";
      var plan = "planned_" +group_reflect[group] + "_h";
      list2.hours = data_course[allocate] - data_course[plan];
      list2.type = group;
      extra.push(list2);
      hours.push(data_course[allocate])
      hours.push(data_course[plan])
    })
  
    //calculate the max y-axis
    y_height = Math.max(...hours);
    y_height = y_height/10*12
    //
    var subgroups = d3.map(data_t, function(d){return(d.teacher_name)}).keys()
    // Add X axis
    var x = d3.scaleBand()
        .domain(group)
        .range([0, width])
        .padding([0.3])
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0,y_height])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
      .domain(groups)
      .range(['#87CEFA','#FFC0CB','	#FF7F50','#9370DB',	'#FFFFE0', '#48D1CC', '#BBFFFF']);
  
    //stack the data? --> stack per subgroup
    //manuallu stack the data
    //Show the course data
    var detail = ["code","id","name","credits","financial_outcome","num_of_students","planned_total","allocated_total"]
    svg_course.append("text")
    .text('text')
    .attr("x",50)
    .attr('y',25)
    .text("Id: " + data_course.id)
    .attr('text-anchor',"left")

    svg_course.append("text")
      .text('text')
      .attr("x",150)
      .attr('y',55)
      .text("code: " + data_course.code)
      .attr('text-anchor',"left")

      svg_course.append("text")
      .text('text')
      .attr("x",150)
      .attr('y',25)
      .text("Name: " + data_course.name)
      .attr('text-anchor',"left")

      svg_course.append("text")
      .text('text')
      .attr("x",50)
      .attr('y',55)
      .text("Credits: " + data_course.credits)
      .attr('text-anchor',"left")

      svg_course.append("text")
      .text('text')
      .attr("x",300)
      .attr('y',25)
      .text("Budget: " + data_course.financial_outcome + "kr")
      .attr('text-anchor',"left")

      svg_course.append("text")
      .text('text')
      .attr("x",300)
      .attr('y',55)
      .text("Students nbr: " + data_course.num_of_students)
      .attr('text-anchor',"left")

      svg_course.append("text")
      .text('text')
      .attr("x",460)
      .attr('y',25)
      .text("Time (planned_total): " + data_course.num_of_students + "h")
      .attr('text-anchor',"left")

      svg_course.append("text")
      .text('text')
      .attr("x",460)
      .attr('y',55)
      .text("Time (allocated_total): " + data_course.allocated_total + "h")
      .attr('text-anchor',"left")

    // Show the bars
    svg.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(data_t)
      .enter().append("g")
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { 
            var name = d.teacher_name;
            var id = d.teacher_id;
            d.part.map(part=>{
              part["name"] = name;
              part["id"] = id;
            })
            return d.part;
         })
        .enter().append("rect")
          .attr("fill", function(d) {
              return color(d.type); 
          })
          .attr("stroke","black")
          .attr("x", function(d) { return x(group_reflect[d.type]); })
          .attr("y", function(d) { 
              list[d.type] = d.hours + list[d.type]
              return y(list[d.type]); 
          })
          .attr("height", function(d) {
                return y(list[d.type] - d.hours) - y(list[d.type]); 
          })
          .attr("width",function(d){
              return x.bandwidth()
          })
          .on("mouseover", function(d) {
            var tooltip=d3.select("#my_dataviz")
            .append("div")
            .attr("class","tooltip")
            .attr("id","tooltipid")
            .style("opacity",0.0)
             .html("<b>Name:</b> " +d.name+"<br/>"+" <b>Type:</b> "+d.type+"<br/>"+" <b>Hours:</b> "+d.hours+"<br/>")
             .style("left",(d3.event.pageX) +"px")
             .style("top",(d3.event.pageY +20)+"px")
             .style("opacity",1.0)
          })
          .on("mousemove", function(d) {
            document.body.querySelector("#tooltipid").remove();
            var tooltip=d3.select("#my_dataviz")
            .append("div")
            .attr("class","tooltip")
            .attr("id","tooltipid")
            .style("opacity",0.0)
             .html("<b>Name:</b> " +d.name+"<br/>"+" <b>Type:</b> "+d.type+"<br/>"+" <b>Hours:</b> "+d.hours+"<br/>")
             .style("left",(d3.event.pageX) +"px")
             .style("top",(d3.event.pageY +20)+"px")
             .style("opacity",1.0)
          })
          .on("mouseout",function (d) {
            document.body.querySelector("#tooltipid").remove();
          })
          .on("click", d => {
            if (d.id <= 84) {
              propfunction(d.id);
              clickFromOutside();
            }
          });
          svg
          .append('defs')
          .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
          .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1);
    // Show the bars
    svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(data_t)
    .enter().append("g")
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { 
          var name = d.teacher_name;
          var id = d.teacher_id;
          d.part.map(part=>{
            part["name"] = name;
            part["id"] = id;
          })
          return d.part;
       })
      .enter().append("rect")
        .attr("fill", function(d) {
            if(d.id === active_teacher) {
              return 'url(#diagonalHatch)';
            }
            return color(d.type); 
        })
        .attr("stroke","black")
        .attr("x", function(d) { return x(group_reflect[d.type]); })
        .attr("y", function(d) { 
            list_s[d.type] = d.hours + list_s[d.type]
            return y(list_s[d.type]); 
        })
        .attr("height", function(d) {
              return y(list_s[d.type] - d.hours) - y(list_s[d.type]); 
        })
        .attr("width",function(d){
            return x.bandwidth()
        })
        .on("mouseover", function(d) {
          var tooltip=d3.select("#my_dataviz")
          .append("div")
          .attr("class","tooltip")
          .attr("id","tooltipid")
          .style("opacity",0.0)
           .html("<b>Name:</b> " +d.name+"<br/>"+" <b>Type:</b> "+d.type+"<br/>"+" <b>Hours:</b> "+d.hours+"<br/>")
           .style("left",(d3.event.pageX) +"px")
           .style("top",(d3.event.pageY +20)+"px")
           .style("opacity",1.0)
        })
        .on("mousemove", function(d) {
          document.body.querySelector("#tooltipid").remove();
          var tooltip=d3.select("#my_dataviz")
          .append("div")
          .attr("class","tooltip")
          .attr("id","tooltipid")
          .style("opacity",0.0)
           .html("<b>Name:</b> " +d.name+"<br/>"+" <b>Type:</b> "+d.type+"<br/>"+" <b>Hours:</b> "+d.hours+"<br/>")
           .style("left",(d3.event.pageX) +"px")
           .style("top",(d3.event.pageY +20)+"px")
           .style("opacity",1.0)
        })
        .on("mouseout",function (d) {
          document.body.querySelector("#tooltipid").remove();
        })
        .on("click", d => {
          if (d.id <= 84) {
            propfunction(d.id);
            clickFromOutside();
          }
        });
  //show the  comparison to the plan    
    svg.append("g")
      .selectAll("rect")
        .data(extra)
        .enter().append("rect")
          .attr("fill", function(d) { 
            if(d.hours < 0){
              return '#FFFFFF';
            } else {
              return color(d.type);
            }
          })
          .attr("stroke","black")
          .attr("x", function(d) { return x(group_reflect[d.type]); })
          .attr("y", function(d) {
            if(d.hours < 0)
              return y(list[d.type] - d.hours);
            else
              return y(list[d.type] + d.hours); 
          })
          .attr("height", function(d) {
            if(d.hours < 0){
              return  y(list[d.type]) - y(list[d.type] - d.hours)
            }
            else
              {
                return 0; 
              }
          })
          .attr("width",x.bandwidth()) 
          .on("mouseover", function(d) {
            if(d.hours < 0){
              var tooltip=d3.select("#my_dataviz")
              .append("div")
              .attr("class","tooltip")
              .attr("id","tooltipid")
              .html("<b>Lack: </b>"+d.hours+ "h" + "<br/>")
              .style("left",(d3.event.pageX) +"px")
              .style("top",(d3.event.pageY +20)+"px")
              .style("opacity",1.0)
            }
          })
          .on("mouseout",function (d) {
            document.body.querySelector("#tooltipid").remove();
          });
  
    //draw black lines
    var g = svg.append("g")
    g.selectAll("rect")
        .data(extra)
        .enter().append("rect")
        .attr("fill", function(d) {
              return '#000000'; 
        })
        .attr("stroke","black")
        .attr("x", function(d) { return x(group_reflect[d.type]); })
        .attr("y", function(d) { 
          if(d.hours < 0)
            return y(list[d.type] - d.hours);
          else if(d.hours == 0)
            return y(list[d.type]); 
          else{
            return y(list[d.type] - d.hours); 
              }
        })
        .attr("height", function(d) {
            return y(y_height /100 * 99.5); 
        })
        .attr("width",function(d){
            return x.bandwidth() +15
        })
        .attr("transform", "translate(-7,0)")
    
    //show text
    g.selectAll("text")
    .data(extra)
    .enter().append("text")
    .text(function(d){
        if(d.hours < 0)
          return ("-" + (-d.hours) + "h")
        else if(d.hours == 0)
          return ("+0h")
        else{
          return ("+" + (d.hours) + "h") 
        }      
    })
    .attr('fill',function(d){
      if(d.hours < 0)
          return "red"  
      else
          return "green"   
    })
    .attr('x', function(d) { return x(group_reflect[d.type]); })
    .attr("y", function(d) { 
          if(d.hours < 0)
            return y(list[d.type] - d.hours) - 5;
          else if(d.hours == 0)
            return y(list[d.type]) -5; 
          else{
            return y(list[d.type]) -5; 
          }
        })
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .attr("transform", "translate(25,0)")
  }

  render() {

    var displayContent;
    if(this.state.active_course === null) {
      displayContent = <div><h4 className="c-overview-message">Select a course to display the course’s information here</h4></div>
    } else {
      displayContent = <><div id="course_info"></div><div id="my_dataviz"></div></>
    }

    return (
      <div className="coursedetails">
        {displayContent}
      </div>
    );
  }

}

export default CourseDetails;