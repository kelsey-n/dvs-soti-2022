import { useState, useEffect, useRef } from 'react';
import {
  arc,
  min,
  pie,
  select,
  sum,
  format,
  range,
  interpolate,
  scaleOrdinal,
  schemeBlues,
  schemeSet3,
  scaleLinear,
  max,
} from 'd3';
import totalToolUsage from '../../constants';

const width = 1000;
const height = 1000;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

console.log(totalToolUsage);

function DonutChart({ data, year, innerRadiusScale, outerRadiusScale, sort }) {
  const ref = useRef();

  const arcGenerator = arc()
    .innerRadius(innerRadiusScale(totalToolUsage[year]))
    .outerRadius(function (d) {
      return (
        innerRadiusScale(totalToolUsage[year]) +
        outerRadiusScale(d.data[`${year}_meantools`])
      );
    })
    .cornerRadius(3);

  // Handle drawing donut
  useEffect(() => {
    const svg = select(ref.current);

    // Default sorting of the pie layout is by value descending (number of users of each tool)
    const pieGenerator = pie().value(function (d) {
      return d[`${year}_users`];
    });

    // Apply a custom sort function when we change the sort
    if (sort === 'toolName') {
      pieGenerator.sort(function (a, b) {
        return a.tool.localeCompare(b.tool);
      });
    }

    // TEMPORARY color scale
    const color = scaleOrdinal()
      .domain(data.map((d) => d.tool))
      .range(schemeSet3);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function. Inspired by https://d3-graph-gallery.com/graph/donut_basic.html
    svg
      .selectAll('.ring-arc')
      .data(pieGenerator(data))
      .join('path')
      .attr('class', 'ring-arc')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.data.tool))
      .attr('stroke', 'black')
      .style('stroke-width', '0.5px')
      .style('opacity', 0.7);
  }, [sort]);

  return <svg ref={ref} width={width} height={height} />;
}

export default DonutChart;
