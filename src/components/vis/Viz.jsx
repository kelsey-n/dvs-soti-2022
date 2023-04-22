import { useState, useEffect, useRef } from 'react';
import DonutChart from './DonutChart';
import data from '../../assets/mergedOutputAllYears_v6.csv';
import { select } from 'd3';

const width = 500;
const height = 500;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

function Viz() {
  const ref = useRef();

  const data2022 = data.filter((d) => d.total_users > 30);
  //   console.log(data2022);

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

    // Test drawing one donut chart
  }, []);

  //   return <svg ref={ref} width={width} height={height} />;
  return <DonutChart data={data2022} />;
}

export default Viz;
