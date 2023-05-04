import { useState, useEffect, useRef, memo } from 'react';
import {
  max,
  select,
  scaleBand,
  scaleLinear,
  min,
  extent,
  hcl,
  format,
} from 'd3';
import DonutChartSpring from './DonutChartSpring';
import data from '../../assets/mergedOutputAllYears_edited_5_4_recalcGrowth.csv';
import metadata from '../../assets/metadata_5_2_index.csv';
import { fontColors } from '../../constants';

const margin = { top: 40, bottom: 0, left: 40, right: 40 };
// const margin = { top: 0, bottom: 0, left: 0, right: 0 };
const outerRingMargin = 40;

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
  clickedTool,
  setClickedTool,
}) {
  const ref = useRef();
  const svgRadius =
    min([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom,
    ]) / 2;
  const minTotalUsers = window.innerWidth < 1024 ? 250 : 30;

  const [hoveredTool, setHoveredTool] = useState(null);
  const [hoveredToolColor, setHoveredToolColor] = useState(null);
  const [clickedToolColor, setClickedToolColor] = useState(null);

  // Individual states to send to each donut to set tooltip positions
  const [TTPos2022, setTTPos2022] = useState(null);
  const [TTPos2021, setTTPos2021] = useState(null);
  const [TTPos2020, setTTPos2020] = useState(null);
  const [TTPos2019, setTTPos2019] = useState(null);
  const [TTPos2018, setTTPos2018] = useState(null);
  const [TTPos2017, setTTPos2017] = useState(null);
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
    (d) => d.total_users >= minTotalUsers // in general, we will only consider those tools with at least a certain number of users over all 6 years - and reduce this number on smaller screens
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
  let innerRadiusScale, outerRadiusDefault, innerRadiusBandwidth;
  const innerRadiusRange =
    ringPosition === 'year'
      ? [svgRadius / 6, svgRadius - outerRingMargin + svgRadius / 6]
      : [0, svgRadius - outerRingMargin];

  if (ringPosition === 'year') {
    innerRadiusScale = scaleBand()
      .domain([2017, 2018, 2019, 2020, 2021, 2022])
      .range(innerRadiusRange);
    // Find the  distance between any 2 years in the years view (scaleBand so this should be equal)
    innerRadiusBandwidth = innerRadiusScale.bandwidth();
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
    // Find the minimum distance between consecutive years in the tool usage view
    const ranges = [2018, 2017, 2020, 2019, 2022, 2021].map((d) =>
      innerRadiusScale(metadata.filter((r) => r.year === d)[0].toolusage)
    );
    const differences = [];
    for (let i = 1; i < ranges.length; i++) {
      const difference = Math.abs(ranges[i] - ranges[i - 1]);
      differences.push(difference);
    }
    // Set the default radius to slightly below this min distance (since we have 2 rings that are very close together)
    outerRadiusDefault = Math.floor(min(differences));
  }

  // Only set the outer radius scale (to be proportional to total tool usage) when we position rings by year
  const outerRadiusScale = scaleLinear()
    .domain([0, max(metadata.map((d) => d.toolusage))])
    .range([0, innerRadiusBandwidth < 30 ? innerRadiusBandwidth : 30]);

  //   // Add parent components for all groups of elements
  //   useEffect(() => {
  //     const svg = d3.select(ref.current);
  //     svg.attr('transform', `translate(${margin.left}, ${margin.top})`);
  //     one(svg, 'g', 'current-data-line-parent');
  //     one(svg, 'g', 'bar-metric-parent');
  //     one(svg, 'g', 'bar-listing-parent');
  //   });

  let hoveredData;
  if (hoveredTool) {
    hoveredData = dataFiltered.filter((d) => d.tool === hoveredTool)[0];
  } else if (clickedTool) {
    hoveredData = dataFiltered.filter((d) => d.tool === clickedTool)[0];
  }

  // Clear clicked tool on click of svg container, not elements
  const handleContainerClick = (event) => {
    if (event.target === ref.current) setClickedTool(null);
  };

  return (
    <div className="viz-svg-container">
      <svg
        ref={ref}
        width={width}
        height={height}
        onClick={handleContainerClick}
      >
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
            outerRadiusDefault={outerRadiusDefault}
            sort={sort}
            ringPosition={ringPosition}
            hoveredTool={hoveredTool}
            setHoveredTool={setHoveredTool}
            setHoveredToolColor={setHoveredToolColor}
            setClickedToolColor={setClickedToolColor}
            clickedTool={clickedTool}
            setClickedTool={setClickedTool}
            setTTPos={eval(`setTTPos${year}`)} // Only send the relevant year's tooltip position setter to update in that donut
            // Array of all tt position setters to set all to null on mouseOut - prevents tooltip jumping before all states updated
            allSetTTPos={[
              setTTPos2017,
              setTTPos2018,
              setTTPos2019,
              setTTPos2020,
              setTTPos2021,
              setTTPos2022,
            ]}
            userInput={userInput}
          />
        ))}
      </svg>
      {/* Extra tooltip here for hovered tool name  */}
      {(hoveredTool || clickedTool) && (
        <>
          <div
            className="tooltip tool-name"
            style={{
              backgroundColor: clickedTool
                ? clickedToolColor
                : hoveredToolColor,
              color: clickedTool
                ? hcl(clickedToolColor).l > 63
                  ? fontColors.darkFontColor
                  : fontColors.lightFontColor
                : hcl(hoveredToolColor).l > 63
                ? fontColors.darkFontColor
                : fontColors.lightFontColor,
            }}
          >
            {hoveredData.tool}
          </div>
          <div
            className="tooltip tool-info"
            style={
              {
                // backgroundColor: hoveredToolColor,
                // color:
                //   hcl(hoveredToolColor).l > 63
                //     ? fontColors.darkFontColor
                //     : fontColors.lightFontColor,
              }
            }
          >
            {sort === 'toolName' || sort === 'toolUsage'
              ? `${format(',')(hoveredData.total_users)} users`
              : sort === 'absGrowth'
              ? `${format('+,')(
                  hoveredData.absolutegrowth
                )} users from '17 to '22`
              : `used by ${format('+.0%')(
                  hoveredData.percgrowth_responders
                )} of respondents from '17 to '22`}
          </div>
        </>
      )}
      {/* Show tooltip for each donut */}
      {hoveredTool &&
        years.map((year) =>
          // Only render each ring's tooltip if not null - prevents old state of tooltip leading to 'jumping' effect
          eval(`TTPos${year}`) !== null ? (
            <div
              key={year}
              className="tooltip"
              style={{
                transform: `translate(${
                  eval(`TTPos${year}`)[0] + width / 2
                }px, ${eval(`TTPos${year}`)[1] + height / 2}px)`,
              }}
            >
              {hoveredData[`${year}_users`] +
                (hoveredData[`${year}_users`] === 1 ? ' user' : ' users')}
            </div>
          ) : null
        )}
    </div>
  );
}

const MemoizedViz = memo(Viz);
export default MemoizedViz;
