import React, { Component } from 'react';
import './icicle.css';
import * as d3 from "d3";

class Icicle extends Component {
  constructor() {
    super();
    this.state = {
        teachers_data: require('../../data/flare-2.json')
    }
  }

  componentDidMount() {
      this.drawIcicle();
  }

  drawIcicle() {
    var data = this.state.teachers_data;
    var width = 300;
    var height = 200;
    var format = d3.format(",d");
    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

    const root = partition(data);
    let focus = root;
    console.log(focus);
    console.log(focus.descendants());
  
    const svg = d3.select("#icicle")
        .append('svg')
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");
  
    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y0},${d.x0})`);
  
    const rect = cell.append("rect")
        .attr("width", d => d.y1 - d.y0 - 2) // -2 = gap between the rects
        .attr("height", d => rectHeight(d))
        .attr("fill-opacity", 0.6)
        .attr("fill", d => {
          if (!d.depth) return "#cccccc";
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .style("cursor", "pointer")
        .on("click", clicked);
  
    const text = cell.append("text")
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .attr("x", 4)
        .attr("y", 13)
        .attr("fill-opacity", d => +labelVisible(d)); // Dissappear text if text larger than rectangle.
  
    text.append("tspan")
        .text(d => d.data.name);
  
    const tspan = text.append("tspan")
        .attr("fill-opacity", d => labelVisible(d) * 0.7)
        .text(d => ` ${format(d.value)}`);
  
    cell.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
  
    function clicked(p) {
      console.log(p);
      if (!p.depth) return;
      focus = focus === p ? p = p.parent : p; // If clicking at the leftmost rectangle, goes to parent.
  
      root.each(d => d.target = {
        x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
        x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
        y0: d.y0 - p.y0,
        y1: d.y1 - p.y0
      });
  
      const t = cell.transition().duration(750)
          .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
  
      rect.transition(t).attr("height", d => rectHeight(d.target));
      text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
      tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.7);
    }
    
    function rectHeight(d) {
      return d.x1 - d.x0 - Math.min(2, (d.x1 - d.x0) / 2);
    }
  
    function labelVisible(d) {
      return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }

    function partition(data) {
      const root = d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.height - a.height || b.value - a.value); //biggest partition furthest up
      return d3.partition()
          .size([height, (root.height + 1) * width / 3])
        (root);
    }
    
    return svg.node();
  }


  render() {
    return (
      <div id="icicle">
      </div>
    );
  }

}

export default Icicle;