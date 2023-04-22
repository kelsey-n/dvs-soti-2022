import { sum } from 'd3';
import data from './assets/mergedOutputAllYears_v6.csv';

// TEMPORARY - generate this from Python instead since we want to get the number of respondents too
let totalToolUsage = {};
const years = [2022, 2021, 2020, 2019, 2018, 2017];

for (const year of years) {
  totalToolUsage[year] = sum(data.map((d) => d[`${year}_users`]));
}

export default totalToolUsage;
