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
} from 'd3';

const width = 500;
const height = 500;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

function DonutChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = select(ref.current);

    const arcGenerator = arc().innerRadius(30).outerRadius(50);
    const pieGenerator = pie()
      .value(function (d) {
        return d['2022_users'];
      })
      .sort(null);

    //   const path = svg.selectAll('path').data(pieG)

    // -----------------------------------------------

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // Create dummy data
    // const data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

    // set the color scale
    const color = scaleOrdinal()
      .domain(data.map((d) => d.tool))
      .range(schemeSet3);

    // Compute the position of each group on the pie:
    // const pie = pie().value((d) => d[1]);

    // const data_ready = pie(Object.entries(data));

    console.log(pieGenerator(data));
    console.log(data);

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
