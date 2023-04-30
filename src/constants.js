import { sum } from 'd3';
import data from './assets/mergedOutputAllYears_v6.csv';

// TEMPORARY - generate this from Python instead since we want to get the number of respondents too
let totalToolUsage = {};
const years = [2022, 2021, 2020, 2019, 2018, 2017];

for (const year of years) {
  totalToolUsage[year] = sum(data.map((d) => d[`${year}_users`]));
}

export default totalToolUsage;
// -------------------------------------------------------------------

export const dataFilters = {
  minTotalUsers: 30,
};

// TRY making corner radius dependent on users...? maybe not though

// CHECK arcGenerator of 2019 powerpoint, filtering out users of 1000. Arity of output must be equal - check what EXACTLY the arc generator returns for powerpoint 2019 both before and after inner radius change
// arity error is resulting in those arcs not animating.
// the fewer datapoints we have, we don't get the arc flag error

// initial arcgen:
// 9.005,-476.906A3,3,0,0,1,-6.043,-479.962A480,480,0,0,1,-3.019,-479.991A3,3,0,0,1,0,-476.991L0,-355.558A3,3,0,0,1,-2.975,-352.558A352.571,352.571,0,0,0,-3.682,-352.551A3,3,0,0,1,-6.712,-355.494Z

// ISSUE:
// big arc to small arc doesn't work
// small arc to big arc doesn't interpolate properly

// TESTING:
// inspect what arcGen returns for the 2019 powerpoint both before and after:
// NOTE that we're now using a zero scale instead of the extent in the inner radius scale - ppt still not moving
// before: M-7.588,-401.859   A3,3,0,0,1,-4.623,-404.915     A404.941,404.941,0,0,1,-3.022,-404.93    A3,3,0,0,1,0,-401.93    L0,-395.523    A3,3,0,0,1,-2.977,-392.523    A392.534,392.534,0,0,0,-4.434,-392.509    A3,3,0,0,1,-7.467,-395.452 Z
// after:  M-5.522,-292.438   A2.761,2.761,0,1,1,0,-292.49   L0,-285.54    A2.696,2.696,0,0,1,-5.391,-285.489  Z

// example of a big arc:
// M0,-293.924   A3,3,0,0,1,3.031,-296.924   A296.94,296.94,0,0,1,239.368,-175.717   A3,3,0,0,1,238.7,-171.505   L232.135,-166.789   A3,3,0,0,1,227.967,-167.449   A282.857,282.857,0,0,0,2.969,-282.842   A3,3,0,0,1,0,-285.841  Z

// GETTING TOWARDS A SOLUTION:
// arcs that have less than the required number of path points need to have those added in: we can add in the necessary type of point (arc or line) and have the start & end position be the same, as well as the end position
// from the previous type of point. For arcs, not sure what rx, ry, x-axis-rotation or the arc flags should be - same as a previous arc? Based on patterns above, rx and ry are the same for every arc, and
// x-axis-rotation is 0

// THE CORNER RADIUS IS MISSING FROM SOME ARCS....

export const introText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
