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
  selectAll,
} from 'd3';
import totalToolUsage from '../../constants';

const width = 1000;
const height = 1000;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

console.log(totalToolUsage);

function DonutChart({
  data,
  year,
  innerRadiusScale,
  outerRadiusScale,
  sort,
  hoveredTool,
  setHoveredTool,
  showTooltip,
  setShowTooltip,
  hoveredData,
  setHoveredData,
}) {
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
    let tooltipPos;

    // Default sorting of the pie layout is by value descending (number of users of each tool)
    const pieGenerator = pie().value(function (d) {
      return d[`${year}_users`];
    });

    const calculateTooltipPos = () => {
      const hoveredData = pieGenerator(data).filter(
        (d) => d.data.tool === hoveredTool
      )[0];
      return arcGenerator.centroid(hoveredData);
    };

    tooltipPos = hoveredTool ? calculateTooltipPos() : [0, 0];

    // Apply a custom sort function when we change the sort
    // Also need to recalculate tooltip positions based on the new generator
    if (sort === 'toolName') {
      pieGenerator.sort(function (a, b) {
        return a.tool.localeCompare(b.tool);
      });
      tooltipPos = hoveredTool ? calculateTooltipPos() : [-9000, 9000];
    }

    // TEMPORARY color scale
    const color = scaleOrdinal()
      .domain(data.map((d) => d.tool))
      .range(schemeSet3);

    // Tooltip
    const tooltipWidth = 150;

    const tooltip = select(document.querySelector('.viz-svg-container'))
      .append('div')
      .style('width', tooltipWidth + 'px')
      .style('opacity', showTooltip ? 1 : 0)
      .style('pointer-events', 'none')
      .html(hoveredTool)
      // .attr('hidden', true)
      .attr('display', null)
      .classed('tooltip', true)
      .style(
        'transform',
        `translate(${tooltipPos[0] + width / 2}px, ${
          tooltipPos[1] + height / 2
        }px)`
      );

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
      .style('opacity', (d) =>
        hoveredTool === null ? 0.7 : d.data.tool === hoveredTool ? 1 : 0.3
      )
      .on('mouseover', (event, d) => {
        //works with mousemove
        setHoveredTool(d.data.tool);
        setShowTooltip(true);
        setHoveredData(d);
      })
      .on('mouseout', () => {
        setHoveredTool(null);
        setShowTooltip(false);
        selectAll('.tooltip').remove();
      });
  }, [sort, hoveredTool]);

  return <svg ref={ref} width={width} height={height} />;
}

export default DonutChart;
