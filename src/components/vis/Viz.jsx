import { useState, useEffect, useRef } from 'react';
import { max, select, scaleLinear, min, extent } from 'd3';
import DonutChart from './DonutChart';
import data from '../../assets/mergedOutputAllYears_v6.csv';
import totalToolUsage from '../../constants';

const width = 1000;
const height = 1000;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };
const outerRingMargin = 20;

const years = [2022, 2021, 2020, 2019, 2018, 2017];
let data2022, data2021, data2020, data2019, data2018, data2017;
const datasetNames = {
  2022: data2022,
  2021: data2021,
  2020: data2020,
  2019: data2019,
  2018: data2018,
  2017: data2017,
};

function Viz({ sort }) {
  const ref = useRef();

  const datasets = [];

  // Filter & aggregate for each year here (including eventually having dynamic number of tools in 'Other')
  const dataFiltered = data.filter((d) => d.total_users > 30); // in general, we will only consider those tools with at least 30 users over all 6 years

  //   for (const [year, dataset] of Object.entries(datasetNames)) {
  //     dataset = dataFiltered;
  //   }
  //   console.log(data2019);

  // Scales
  const innerRadiusScale = scaleLinear()
    // .domain([0, max(Object.values(totalToolUsage))])
    // .range([0, min([width, height]) / 2 - outerRingMargin])
    .domain(extent(Object.values(totalToolUsage)))
    .range([20, min([width, height]) / 2 - outerRingMargin]);

  const outerRadiusScale = scaleLinear()
    .domain(
      extent(
        dataFiltered.map((d) => years.map((y) => d[`${y}_meantools`])).flat()
      )
    )
    .range([3, 30]);

  //   console.log(dataFiltered);

  //   // Add parent components for all groups of elements
  //   useEffect(() => {
  //     const svg = d3.select(ref.current);
  //     svg.attr('transform', `translate(${margin.left}, ${margin.top})`);
  //     one(svg, 'g', 'current-data-line-parent');
  //     one(svg, 'g', 'bar-metric-parent');
  //     one(svg, 'g', 'bar-listing-parent');
  //   });

  useEffect(() => {
    const svg = select(ref.current);
  }, []);

  return (
    <svg ref={ref} width={width} height={height}>
      {years.map((year) => (
        <DonutChart
          key={year}
          data={dataFiltered}
          year={year}
          innerRadiusScale={innerRadiusScale}
          outerRadiusScale={outerRadiusScale}
          sort={sort}
        />
      ))}
    </svg>
  );
}

export default Viz;
