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

const margin = { top: 20, bottom: 20, left: 20, right: 20 };

function DonutChartSpring({
  width,
  height,
  data,
  metadata,
  year,
  innerRadiusScale,
  outerRadiusScale,
  outerRadiusDefault,
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
  const pieGenerator = pie()
    .value(function (d) {
      return d[`${year}_users`];
    })
    .startAngle(0.05)
    .endAngle(2 * Math.PI - 0.05);
  // Apply a custom sort function when we change the sort
  // We do this up here because we also need to recalculate tooltip positions based on the new generator
  // This allows the updated pieGenerator to flow into both the sort UE and hovering UE
  if (sort === 'toolName') {
    pieGenerator.sort(function (a, b) {
      return a.tool.localeCompare(b.tool);
    });
  } else if (sort === 'absGrowth') {
    pieGenerator.sort(function (a, b) {
      return b.absolutegrowth - a.absolutegrowth;
    });
  } else if (sort === 'percGrowthUsers') {
    pieGenerator.sort(function (a, b) {
      return b.percgrowth_responders - a.percgrowth_responders;
    });
  }

  // TODO: FIX THIS SO PIE GEN DOESN'T RUN EVERY SINGLE TIME IT DOESN'T CHANGE
  const pieData = useMemo(() => {
    // console.log('pie generator running');
    return pieGenerator(data);
  }, [data]); // TESTING: save pie data here to prevent recalculating it in hovering UE - this seems 'stickier' than recalculating pieGenerator(data) in the hovering UE for tt positioning

  // TEMPORARY color scale
  const color = scaleOrdinal()
    .domain(data.map((d) => d.tool))
    .range(schemeSet3);

  const textTransitionProps = useSpring({
    config: {
      // duration: 1200,
    },
    y: -innerRadiusScale(
      ringPosition === 'year'
        ? year
        : metadata.filter((d) => d.year === year)[0].toolusage
    ),
  });

  // Here we will map over the pieData and return a Slice for each row of data
  const allSlices = pieData.map((sliceData) => {
    return (
      <Slice
        key={sliceData.data.tool}
        sliceData={sliceData}
        year={year}
        color={color(sliceData.data.tool)}
        innerRadiusScale={innerRadiusScale}
        outerRadiusScale={outerRadiusScale}
        outerRadiusDefault={outerRadiusDefault}
        ringPosition={ringPosition}
        hoveredTool={hoveredTool}
        setHoveredTool={setHoveredTool}
        setShowTooltip={setShowTooltip}
        pieData={pieData}
        setTTPos={setTTPos}
        userInput={userInput}
        metadata={metadata}
      />
    );
  });

  return (
    <svg ref={ref} width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {allSlices}
        <animated.text
          className="year-label"
          style={{ ...textTransitionProps }}
        >
          {year === 2021 || year === 2022 ? year : `'${year % 100}`}
        </animated.text>
      </g>
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
  outerRadiusDefault,
  ringPosition,
  hoveredTool,
  setHoveredTool,
  setShowTooltip,
  pieData,
  setTTPos,
  userInput,
  metadata,
  //   setHoveredData,
}) => {
  const arcGenerator = arc()
    // .cornerRadius(3) // corner radius not always applied to every arc (esp smaller arcs) - leading to inequal arity for interpolation (some arcs paths have the corner radius arc, some don't and can't be interpolated to/from arcs that do)
    .innerRadius(
      innerRadiusScale(
        ringPosition === 'year'
          ? year
          : metadata.filter((d) => d.year === year)[0].toolusage
      )
    )
    .outerRadius(
      innerRadiusScale(
        ringPosition === 'year'
          ? year
          : metadata.filter((d) => d.year === year)[0].toolusage
      ) +
        (ringPosition === 'year'
          ? outerRadiusScale(
              metadata.filter((d) => d.year === year)[0].toolusage // outer radius is proportional to tool usage for that year when we order rings by year
            )
          : outerRadiusDefault)
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
      // duration: 1200,
    },
    d: arcGenerator({
      startAngle: sliceData.startAngle,
      endAngle: sliceData.endAngle,
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
        userInput === 'sort' || userInput === 'numTools'
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
