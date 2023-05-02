import { useState, useEffect, useRef } from 'react';
import { max, select, scaleBand, scaleLinear, min, extent } from 'd3';
import DonutChartSpring from './DonutChartSpring';
import data from '../../assets/mergedOutputAllYears_edited_5_2.csv';
import metadata from '../../assets/metadata_5_2_index.csv';
import { dataFilters } from '../../constants';

const margin = { top: 0, bottom: 0, left: 0, right: 0 };
const outerRingMargin = 50;

const years = [2022, 2021, 2020, 2019, 2018, 2017];

const zeroScaleInnerRad = true; // if false, inner radius scale domain goes from min-max of all values. if true, goes from 0-max.

function Viz({
  sort,
  ringWidth,
  ringPosition,
  topNumTools,
  userInput,
  width,
  height,
}) {
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
  useEffect(() => {
    console.log(TTPos2022, setTTPos2022);
    console.log(TTPos2021, setTTPos2021);
    console.log(TTPos2020, setTTPos2020);
    console.log(TTPos2019, setTTPos2019);
    console.log(TTPos2018, setTTPos2018);
    console.log(TTPos2017, setTTPos2017);
  }, []);

  // Filter & aggregate for each year here (including eventually having dynamic number of tools in 'Other')
  const dataFiltered = data.filter(
    (d) => d.total_users >= dataFilters.minTotalUsers // in general, we will only consider those tools with at least a certain number of users over all 6 years
  );
  // .sort((a, b) => b.total_users - a.total_users)
  // .slice(0, topNumTools);

  // console.log(
  //   dataFiltered
  //     .sort((a, b) => b.total_users - a.total_users)
  //     .slice(0, topNumTools)
  // );

  // For each year, find the top tools by number of users for that year, and set the value for all other tools to undefined
  // for (const year of years) {
  //   const tempFilteredData = dataFiltered.sort(
  //     (a, b) => b[`${year}_users`] - a[`${year}_users`]
  //   );
  //   tempFilteredData.forEach((row, idx) => {
  //     if (idx > topNumTools - 1) {
  //       row[`${year}_newUsers`] = 0;
  //       row[`${year}_newMeanTools`] = 0;
  //     } else {
  //       row[`${year}_newUsers`] = row[`${year}_users`];
  //       row[`${year}_newMeanTools`] = row[`${year}_meantools`];
  //     }
  //   });
  // }

  // Scales for ring position (inner radius) & width (outer radius)
  let innerRadiusScale;
  const innerRadiusRange =
    ringPosition === 'year'
      ? [
          min([width, height]) / 2 / 6,
          min([width, height]) / 2 -
            outerRingMargin +
            min([width, height]) / 2 / 6,
        ]
      : [0, min([width, height]) / 2 - outerRingMargin];

  if (ringPosition === 'year') {
    innerRadiusScale = scaleBand()
      .domain([2017, 2018, 2019, 2020, 2021, 2022])
      .range(innerRadiusRange);
  } else {
    innerRadiusScale = scaleLinear()
      .domain(
        ringPosition === 'totalUsage'
          ? zeroScaleInnerRad
            ? [0, max(metadata.map((d) => d.toolusage))]
            : extent(metadata.map((d) => d.toolusage))
          : zeroScaleInnerRad
          ? [0, max(metadata.map((d) => d.respondents))]
          : extent(metadata.map((d) => d.respondents))
      )
      .range(innerRadiusRange);
  }

  // const outerRadiusScale = scaleLinear()
  //   .domain(
  //     ringWidth === 'meanPerTool'
  //       ? [
  //           0,
  //           max(
  //             dataFiltered
  //               .map((d) => years.map((y) => d[`${y}_meantools`]))
  //               .flat()
  //           ),
  //         ]
  //       : [0, max(metadata.map((d) => d.meantools))]
  //   )
  //   .range([0, 30]);

  // Only set the outer radius scale (to be proportional to total tool usage) when we position rings by year
  const outerRadiusScale = scaleLinear()
    .domain([0, max(metadata.map((d) => d.toolusage))])
    .range([0, 30]);

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
            width={width}
            height={height}
            data={dataFiltered}
            metadata={metadata}
            year={year}
            innerRadiusScale={innerRadiusScale}
            outerRadiusScale={outerRadiusScale}
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
      {/* Show tooltip for each donut */}
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
