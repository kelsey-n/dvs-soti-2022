import { useState, useEffect, useRef } from 'react';
import { max, select, scaleLinear, min, extent } from 'd3';
import DonutChart from './DonutChart';
import DonutChartSpring from './DonutChartSpring';
import data from '../../assets/mergedOutputAllYears_v6.csv';
import totalToolUsage, { dataFilters } from '../../constants';

const width = 1000;
const height = 1000;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };
const outerRingMargin = 20;

const years = [2022, 2021, 2020, 2019, 2018, 2017];

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

const zeroScaleInnerRad = true; // if false, inner radius scale domain goes from min-max of all values. if true, goes from 0-max.

function Viz({ sort, ringWidth, ringPosition, topNumTools, userInput }) {
  const ref = useRef();

  const [hoveredTool, setHoveredTool] = useState(null);

  // GET RID OF SHOWTOOLTIP - not being used - using hoveredTool instead as an indication that we are hovering
  const [showTooltip, setShowTooltip] = useState(false);
  // Individual states to send to each donut to set tooltip positions
  const [TTPos2022, setTTPos2022] = useState([0, 0]);
  const [TTPos2021, setTTPos2021] = useState([0, 0]);
  const [TTPos2020, setTTPos2020] = useState([0, 0]);
  const [TTPos2019, setTTPos2019] = useState([0, 0]);
  const [TTPos2018, setTTPos2018] = useState([0, 0]);
  const [TTPos2017, setTTPos2017] = useState([0, 0]);
  // TEMPORARY SOLUTION - otherwise build doesn't pick up ttPos variables - they come across as unused
  // useEffect(() => {
  //   console.log(TTPos2022, setTTPos2022);
  //   console.log(TTPos2021, setTTPos2021);
  //   console.log(TTPos2020, setTTPos2020);
  //   console.log(TTPos2019, setTTPos2019);
  //   console.log(TTPos2018, setTTPos2018);
  //   console.log(TTPos2017, setTTPos2017);
  // }, []);

  // Filter & aggregate for each year here (including eventually having dynamic number of tools in 'Other')
  const dataFiltered = data.filter(
    (d) => d.total_users > dataFilters.minTotalUsers // in general, we will only consider those tools with at least a certain number of users over all 6 years
  );

  // Scales
  const innerRadiusScale = scaleLinear()
    .domain(
      ringPosition === 'totalUsage'
        ? zeroScaleInnerRad
          ? [0, max(Object.values(totalToolUsage))]
          : extent(Object.values(totalToolUsage))
        : zeroScaleInnerRad
        ? [0, max(Object.values(totalRespondents))]
        : extent(Object.values(totalRespondents))
    )
    .range([0, min([width, height]) / 2 - outerRingMargin]);

  const outerRadiusScale = scaleLinear()
    .domain(
      extent(
        dataFiltered.map((d) => years.map((y) => d[`${y}_meantools`])).flat()
      )
    )
    .range([3, 30]);

  //   // Add parent components for all groups of elements
  //   useEffect(() => {
  //     const svg = d3.select(ref.current);
  //     svg.attr('transform', `translate(${margin.left}, ${margin.top})`);
  //     one(svg, 'g', 'current-data-line-parent');
  //     one(svg, 'g', 'bar-metric-parent');
  //     one(svg, 'g', 'bar-listing-parent');
  //   });

  //   useEffect(() => {
  //     const svg = select(ref.current);
  //   }, []);

  const hoveredData = dataFiltered.filter((d) => d.tool === hoveredTool)[0];

  return (
    <div className="viz-svg-container">
      <svg ref={ref} width={width} height={height}>
        {years.map((year) => (
          <DonutChartSpring
            key={year}
            data={dataFiltered}
            year={year}
            innerRadiusScale={innerRadiusScale}
            outerRadiusScale={outerRadiusScale}
            ringWidth={ringWidth}
            sort={sort}
            ringPosition={ringPosition}
            hoveredTool={hoveredTool}
            setHoveredTool={setHoveredTool}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
            setTTPos={eval(`setTTPos${year}`)} // Only send the relevant year's tooltip position setter to that donut
            userInput={userInput}
          />
        ))}
      </svg>
      {/* Extra tooltip here for hovered tool name  */}
      {hoveredTool && <div className="tooltip">{hoveredTool}</div>}
      {/* Show tooltip */}
      {hoveredTool &&
        years.map((year) => (
          <div
            key={year}
            className="tooltip"
            style={{
              transform: `translate(${eval(`TTPos${year}`)[0] + width / 2}px, ${
                eval(`TTPos${year}`)[1] + height / 2
              }px)`,
            }}
          >
            {hoveredData[`${year}_users`]} users
          </div>
        ))}
    </div>
  );
}

export default Viz;
