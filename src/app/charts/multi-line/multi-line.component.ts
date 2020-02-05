import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';
import { MyHealthDataService } from '../../services/my-health-data.service';
import d3Tip from "d3-tip"
// import * as d3-tip from '/../assets/js/lib/d3-tip.js';
// import * as d3-tip from 'tip';

@Component({
  selector: 'chart-multi-line',
  templateUrl: './multi-line.component.html',
  styleUrls: ['./multi-line.component.css']
})
export class MultiLineComponent implements OnChanges {

  constructor(private healthDataService: MyHealthDataService) { }
  @Input("selectedFilterOption") selectedLayoutOption;
  data: any;
  removeChartFromDom(){
    if(document.getElementById('multi-line-chart').children.length > 0){
      document.getElementById('multi-line-chart').children[0].remove(); 
    }
  }
  ngOnChanges() {
    this.removeChartFromDom();
    this.createChart(this.healthDataService.healthData);
  }

  private createChart(healthData): void {
    var data = this.healthDataService.mapHealthDataForChart(healthData, this.selectedLayoutOption);
    var width = 500;
    var height = 300;
    var margin = 50;
    var duration = 250;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;


    /* Format Data */
    var parseDate = d3.timeParse('%Y');
    var parseTime;
    switch (this.selectedLayoutOption) {
      case 'day' || undefined:
        parseTime = d3.timeFormat('%H:%M:%S');
        break;
      case 'week':
        parseTime = d3.timeFormat('%Y-%m-%d');
        break;
      case 'month':
        parseTime = d3.timeFormat('%V-%Y');
        break;
      case 'year':
        parseTime = d3.timeFormat('%m-%Y');
        break;
      default:
    }
    // var parseTime = d3.timeFormat("%Y-%m-%d");
    let all_values = [];
    data.forEach(function (d) {
      d.values.forEach(function (d) {
        d.date = d.date;
        d.value = +d.value;
        all_values.push(d.value);
      });
    });


    /* Scale */
    var xScale = d3.scaleTime()
      .domain(d3.extent(data[0].values, d => d.date)).nice()
      .range([0, width - margin]);

    let min_max_range = [d3.min(all_values, d => d) - 10, d3.max(all_values, d => d)]
    var yScale = d3.scaleLinear()
      .domain(min_max_range).nice()
      .range([height - margin, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    var mainSvg = d3.select('#multi-line-chart').append('svg')
      .attr('width', (width + margin) + 'px')
      .attr('height', (height + margin) + 'px');

    let svg = mainSvg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    const tip = d3Tip()
    tip
      .attr('class', 'd3-tip')
      .html(d => {
        return (
          `<div><strong>Value:</strong> <span style="color:#c675c8">` + d.value + `</span></div>` +
          `<div><strong>Date:</strong> <span style="color:#c675c8">` + parseTime(d.date) + `</span></div>`
        )
      })
    svg.call(tip)

    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

    let lines = svg.append('g')
      .attr('class', 'multi-lines');

    lines.selectAll('.multi-line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'multi-line-group')
      .on('mouseover', function (d, i) {
        svg.append('text')
          .attr('class', 'title-text')
          .style('fill', color(i))
          .text(d.name)
          .attr('text-anchor', 'middle')
          .attr('x', (width - margin) / 2)
          .attr('y', 5);
      })
      .on('mouseout', function (d) {
        svg.select('.title-text').remove();
      })
      .append('path')
      .attr('class', 'chart-line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .on('mouseover', function (d) {
        d3.selectAll('.chart-line')
          .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
          .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style('stroke-width', lineStrokeHover)
          .style('cursor', 'pointer');
      })
      .on('mouseout', function (d) {
        d3.selectAll('.chart-line')
          .style('opacity', lineOpacity);
        d3.selectAll('.circle')
          .style('opacity', circleOpacity);
        d3.select(this)
          .style('stroke-width', lineStroke)
          .style('cursor', 'none');
      });


    /* Add circles in the line */
    lines.selectAll('circle-group')
      .data(data).enter()
      .append('g')
      .style('fill', (d, i) => color(i))
      .selectAll('circle')
      .data(d => d.values)
      .enter()
      .append('g')
      .attr('class', 'circle')
      // .attr('data', function (d) {
      //   var data = {};
      //   data['name'] = d.name;
      //   data['value'] = d.value;
      //   data['date'] = d.date;
      //   //====== Exam Count is not Dimensions.
      //   return JSON.stringify(data);
      // })
      .on('mouseover', function (d) { tip.show(d, this); })
      .on('mouseout', function (d) { tip.hide(d, this); })

      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', circleRadius)
      .style('opacity', circleOpacity)
      .on('mouseover', function (d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr('r', circleRadiusHover);
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr('r', circleRadius);
      });


    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(function (d) {
      return parseTime(d);
    });
    var yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(xAxis);
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    //========= legend Add ============//
    let legend = mainSvg
      .append('g')
      .attr('transform', `translate(${margin}, ${height + margin / 2})`)
      .attr('class', 'tick')
      .append('g')
      .attr('class', 'legend')
      .selectAll('g')
      .data(data.slice())
      .enter().append('g')
      .attr('transform', function (d, i) {
        // return 'translate(0,' + i * 20 + ')';
        return `translate(${i * 90},0)`;
      });
    // let legendSpace = width/data.length;
    legend.append('rect')
      .attr('x', 0)// (legendSpace/2)+i*legendSpace
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d, i) => color(i));

    legend.append('text')
      .attr('x', 25)
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .text(function (d) {
        return d.name;
      });
  }
  ngOnDestroy(): void {
    // d3.select("#multi-line-chart").remove() 
  }

}
