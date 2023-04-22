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

function DonutChart({ data, year, innerRadiusScale, outerRadiusScale }) {
  const ref = useRef();

  // Handle drawing donut
  useEffect(() => {
    const svg = select(ref.current);

    const arcGenerator = arc()
      .innerRadius(innerRadiusScale(totalToolUsage[year]))
      .outerRadius(function (d) {
        return (
          innerRadiusScale(totalToolUsage[year]) +
          outerRadiusScale(d.data[`${year}_meantools`])
        );
      })
      .cornerRadius(3);

    const pieGenerator = pie()
      .value(function (d) {
        return d[`${year}_users`];
      })
      .sort(null);

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // set the color scale
    const color = scaleOrdinal()
      .domain(data.map((d) => d.tool))
      .range(schemeSet3);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('whatever')
      .data(pieGenerator(data))
      .join('path')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.data.tool))
      .attr('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', 0.7);
  }, []);

  return <svg ref={ref} width={width} height={height} />;
}

export default DonutChart;
