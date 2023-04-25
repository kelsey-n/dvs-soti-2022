import { useState, useEffect, useRef, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
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
  local,
} from 'd3';
import totalToolUsage from '../../constants';

const width = 1000;
const height = 1000;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

console.log(totalToolUsage);

function DonutChartSpring({
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

  //   const arcGenerator = arc()
  //     .innerRadius(innerRadiusScale(totalToolUsage[year]))
  //     .outerRadius(function (d) {
  //       return (
  //         innerRadiusScale(totalToolUsage[year]) +
  //         outerRadiusScale(d.data[`${year}_meantools`])
  //       );
  //     })
  //     .cornerRadius(3);

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
  const pieData = useMemo(() => {
    console.log('recalculating pie data');
    return pieGenerator(data);
  }, [data]); // TESTING: save pie data here to prevent recalculating it in hovering UE - this seems 'stickier' than recalculating pieGenerator(data) in the hovering UE for tt positioning

  // TEMPORARY color scale
  const color = scaleOrdinal()
    .domain(data.map((d) => d.tool))
    .range(schemeSet3);

  // Tooltip
  const tooltipWidth = 150;
  let tooltipPos;

  console.log(pieData);

  // Here we will map over the pieData and return a Slice for each row of data
  const allSlices = pieData.map((sliceData, i) => {
    return (
      <Slice
        key={sliceData.data.name}
        sliceData={sliceData}
        year={year}
        color={color(sliceData.data.tool)}
        innerRadiusScale={innerRadiusScale}
      />
    );
  });

  return (
    <svg ref={ref} width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>{allSlices}</g>
    </svg>
  );
}

// Then we will create another component that returns a Slice component (eventually, an animated Slice)
const Slice = ({ sliceData, year, color, innerRadiusScale }) => {
  const arcGenerator = arc()
    .innerRadius(innerRadiusScale(totalToolUsage[year]))
    // .outerRadius(function (d) {
    //   return (
    //     innerRadiusScale(totalToolUsage[year]) +
    //     outerRadiusScale(d.data[`${year}_meantools`])
    //   );
    // })
    .outerRadius(innerRadiusScale(totalToolUsage[year]) + 20)
    .cornerRadius(3);

  const springProps = useSpring({
    to: {
      pos: [sliceData.startAngle, sliceData.endAngle],
    },
  });

  return (
    <animated.path
      d={springProps.pos.to((start, end) => {
        return arcGenerator({
          //   innerRadius: 40,
          //   outerRadius: radius,
          startAngle: start,
          endAngle: end,
        });
      })}
      fill={color}
    />
  );
};

export default DonutChartSpring;
