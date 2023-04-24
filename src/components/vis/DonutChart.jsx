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

// THOUGHTS :
// 3 UEs
// 1: handle initial drawing of arcs - no transition here (or maybe entry animation like we have now) - only runs once - empty dependency array
// 2: handle hovering on an arc - depends on hoveredTool & pieGenerator/sort (when we change the sort, we have to recalculate the tooltip positions with the new pieGenerator)
// 3: handle redrawing on sort change - transition here for shifting arcs: need to interpolate startAngle & endAngle along an arc - depends on pieGenerator/sort
// FIRST STEP: break down what we have into the first 2 UEs, without handling redrawing. Then create the third UE with the sort stuff we have - use local variable to save previous angles on each arc's DOM element

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

  // Default sorting of the pie layout is by value descending (number of users of each tool)
  const pieGenerator = pie().value(function (d) {
    return d[`${year}_users`];
  });
  // Apply a custom sort function when we change the sort
  // We do this up here because we also need to recalculate tooltip positions based on the new generator
  // This allows the updated pieGenerator to flow into both the sort UE and hovering UE
  if (sort === 'toolName') {
    pieGenerator.sort(function (a, b) {
      return a.tool.localeCompare(b.tool);
    });
  }
  const pieData = pieGenerator(data); // TESTING: save pie data here to prevent recalculating it in hovering UE - this seems 'stickier' than recalculating pieGenerator(data) in the hovering UE for tt positioning

  // TEMPORARY color scale
  const color = scaleOrdinal()
    .domain(data.map((d) => d.tool))
    .range(schemeSet3);

  // Tooltip
  const tooltipWidth = 150;
  let tooltipPos;

  // Handle initial drawing:
  useEffect(() => {
    const svg = select(ref.current);

    let angleInterpolation = interpolate(
      pieGenerator.startAngle()(),
      pieGenerator.endAngle()()
    );
    // Set up the arc tween function - this animates all arcs on entry, one after the other
    const arcTween = (d) => {
      let originalEnd = d.endAngle;
      return (t) => {
        let currentAngle = angleInterpolation(t);
        if (currentAngle < d.startAngle) {
          return '';
        }

        d.endAngle = Math.min(currentAngle, originalEnd);

        return arcGenerator(d);
      };
    };

    // Build the donut chart: Basically, each arc of the donut is a path that we build using the arc function. Inspired by https://d3-graph-gallery.com/graph/donut_basic.html
    // Transition inspired by https://endjin.com/blog/2019/08/donut-chart-corkscrew-entry-animation-with-d3-js
    svg
      .selectAll('.ring-arc')
      .data(pieGenerator(data))
      .join('path')
      //   .enter()
      //   .append('path')
      .attr('class', 'ring-arc')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.data.tool))
      .attr('stroke', 'black')
      .style('stroke-width', '0.5px')
      .style('opacity', 0.7);
  }, []);

  // Handle re-sorting
  useEffect(() => {
    const svg = select(ref.current);

    svg
      .selectAll('.ring-arc')
      .data(pieGenerator(data))
      .join('path')
      //   .enter()
      //   .append('path')
      .attr('class', 'ring-arc')
      .attr('d', arcGenerator);
  }, [sort]);

  // Handle hovering on an arc - opacity change & tooltips
  useEffect(() => {
    const svg = select(ref.current);

    const calculateTooltipPos = () => {
      const hoveredData = //pieData.filter(
        pieData.filter((d) => d.data.tool === hoveredTool)[0];
      return arcGenerator.centroid(hoveredData);
    };

    tooltipPos = hoveredTool ? calculateTooltipPos() : [0, 0];

    // Append tooltip to viz container
    select(document.querySelector('.viz-svg-container'))
      .append('div')
      .style('width', tooltipWidth + 'px')
      .style('opacity', showTooltip ? 1 : 0)
      .style('pointer-events', 'none')
      .html(hoveredTool)
      .attr('display', null)
      .classed('tooltip', true)
      .style(
        'transform',
        `translate(${tooltipPos[0] + width / 2}px, ${
          tooltipPos[1] + height / 2
        }px)`
      );

    // Handle opacity change & mouse events on hover
    svg
      .selectAll('.ring-arc')
      .style('opacity', (d) =>
        hoveredTool === null ? 0.7 : d.data.tool === hoveredTool ? 1 : 0.3
      )
      .on('mouseover', (event, d) => {
        setHoveredTool(d.data.tool);
        setShowTooltip(true);
        setHoveredData(d);
      })
      .on('mouseout', () => {
        setHoveredTool(null);
        setShowTooltip(false);
        selectAll('.tooltip').remove();
      });
  }, [hoveredTool]);
  return <svg ref={ref} width={width} height={height} />;
}

export default DonutChart;
