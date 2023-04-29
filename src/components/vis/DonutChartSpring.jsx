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

// TEMPORARY - GET FROM REAL DATA AND PUT AS METADATA
// const totalRespondents = {
//   2017: 5000,
//   2018: 3058,
//   2019: 6782,
//   2020: 5348,
//   2021: 8654,
//   2022: 48325,
// };
const totalRespondents = {
  2017: 2000,
  2018: 3000,
  2019: 4000,
  2020: 5000,
  2021: 6000,
  2022: 7000,
};

console.log(totalToolUsage);

function DonutChartSpring({
  data,
  year,
  innerRadiusScale,
  outerRadiusScale,
  ringWidth,
  sort,
  ringPosition,
  hoveredTool,
  setHoveredTool,
  showTooltip,
  setShowTooltip,
  setTTPos,
  userInput,
  //   hoveredData,
  //   setHoveredData,
}) {
  const ref = useRef();

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
    return pieGenerator(data);
  }, [data]); // TESTING: save pie data here to prevent recalculating it in hovering UE - this seems 'stickier' than recalculating pieGenerator(data) in the hovering UE for tt positioning

  // TEMPORARY color scale
  const color = scaleOrdinal()
    .domain(data.map((d) => d.tool))
    .range(schemeSet3);

  // Here we will map over the pieData and return a Slice for each row of data
  const allSlices = pieData.map((sliceData, i) => {
    return (
      <Slice
        key={sliceData.data.name}
        sliceData={sliceData}
        year={year}
        color={color(sliceData.data.tool)}
        innerRadiusScale={innerRadiusScale}
        outerRadiusScale={outerRadiusScale}
        ringWidth={ringWidth}
        ringPosition={ringPosition}
        hoveredTool={hoveredTool}
        setHoveredTool={setHoveredTool}
        setShowTooltip={setShowTooltip}
        pieData={pieData}
        setTTPos={setTTPos}
        userInput={userInput}
      />
    );
  });

  return (
    <svg ref={ref} width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>{allSlices}</g>
    </svg>
  );
}

// Then we will create another component that returns an animated Slice component
const Slice = ({
  sliceData,
  year,
  color,
  innerRadiusScale,
  outerRadiusScale,
  ringWidth,
  ringPosition,
  hoveredTool,
  setHoveredTool,
  setShowTooltip,
  pieData,
  setTTPos,
  userInput,
  //   setHoveredData,
}) => {
  const arcGenerator = arc()
    // .cornerRadius(3) // corner radius not always applied to every arc (esp smaller arcs) - leading to inequal arity for interpolation (some arcs paths have the corner radius arc, some don't and can't be interpolated to/from arcs that do)
    .outerRadius(
      ringWidth === 'meanPerYear'
        ? innerRadiusScale(
            ringPosition === 'totalUsage'
              ? totalToolUsage[year]
              : totalRespondents[year]
          ) + 24 // this will be a constant for each donut (avg num tools used by respondents each year), but we will scale to determine the number among the diff donuts
        : innerRadiusScale(
            ringPosition === 'totalUsage'
              ? totalToolUsage[year]
              : totalRespondents[year]
          ) + outerRadiusScale(sliceData.data[`${year}_meantools`])
    )
    .innerRadius(
      innerRadiusScale(
        ringPosition === 'totalUsage'
          ? totalToolUsage[year]
          : totalRespondents[year]
      )
    );

  // Inspired by donut data transition here: https://www.react-graph-gallery.com/donut
  const sortProps = useSpring({
    config: {
      // duration: 1200,
    },
    to: {
      pos: [sliceData.startAngle, sliceData.endAngle],
    },
  });

  // Path animation inspired by: https://dev.to/tomdohnal/react-svg-animation-with-react-spring-4-2kba
  const radiusProps = useSpring({
    config: {
      duration: 1200,
    },
    d: arcGenerator({
      innerRadius: innerRadiusScale(
        ringPosition === 'totalUsage'
          ? totalToolUsage[year]
          : totalRespondents[year]
      ),
      startAngle: sliceData.startAngle,
      endAngle: sliceData.endAngle,
      outerRadius:
        innerRadiusScale(
          ringPosition === 'totalUsage'
            ? totalToolUsage[year]
            : totalRespondents[year]
        ) +
        (ringWidth === 'meanPerTool'
          ? outerRadiusScale(sliceData.data[`${year}_meantools`])
          : 24),
    }),
  });

  // Tooltip
  const calculateTooltipPos = (pieData) => {
    const hoveredData = //pieData.filter(
      pieData.filter((d) => d.data.tool === hoveredTool)[0];
    return arcGenerator.centroid(hoveredData);
  };

  // STALE STATE - old value of state remains before this UE goes into effect, giving
  // effect of TT jumping from previous hovered position to new one
  useEffect(() => {
    if (sliceData.data.tool !== hoveredTool) return;
    setTTPos(calculateTooltipPos(pieData));
  }, [hoveredTool]);

  const handleMouseOver = () => {
    setHoveredTool(sliceData.data.tool);
    // setShowTooltip(true);
    // setHoveredData(sliceData);
  };
  const handleMouseOut = () => {
    setHoveredTool(null);
    setShowTooltip(false);
    // NOT SURE IF NEEDED - STILL GETTING JUMPING EFFECT FROM OLD POSITION
    setTTPos([0, 0]);
  };

  return (
    <animated.path
      d={
        userInput === 'sort'
          ? sortProps.pos.to((start, end) => {
              return arcGenerator({
                startAngle: start,
                endAngle: end,
              });
            })
          : radiusProps.d
      }
      fill={color}
      style={{
        opacity:
          hoveredTool === null
            ? 0.7
            : sliceData.data.tool === hoveredTool
            ? 1
            : 0.3,
        stroke: 'black',
        strokeWidth: '0.5px',
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  );
};

export default DonutChartSpring;
