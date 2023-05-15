export const fontColors = {
  lightFontColor: 'rgba(255, 255, 255, 0.87)',
  darkFontColor: '#242424',
};

export const colorScheme = [
  '#FFE082',
  '#FF80AB',
  '#FF4081',
  '#80DEEA',
  '#FFC107',
  '#81C784',
  '#EF5350',
  '#BA68C8',
  '#FF8A65',
  '#4FC3F7',
  '#F06292',
  '#C5E1A5',
  '#9575CD',
  '#FFB74D',
  '#00BCD4',
  '#4CAF50',
  '#FFD54F',
  '#8BC34A',
  '#E91E63',
  '#90CAF9',
  '#F48FB1',
  '#FF9800',
];

const colors = [
  '#FFD54F',
  '#B2EBF2',
  '#A5D6A7',
  '#CE93D8',
  '#FFCC80',
  '#90CAF9',
  '#F48FB1',
  '#BDBDBD',
  '#FFB6C1',
  '#C8E6C9',
  '#FF80CC',
  '#FFEB3B',
  '#FF6F00',
];

// export const colorScheme = [
//   '#FFE082',
//   '#FF80AB',
//   '#80DEEA',
//   '#81C784',
//   '#EF5350',
//   '#BA68C8',
//   '#FF8A65',
//   '#4FC3F7',
//   '#F06292',
//   '#C5E1A5',
//   '#9575CD',
//   '#FFB74D',
//   '#FFD54F',
//   '#B2EBF2',
//   '#A5D6A7',
//   '#CE93D8',
//   '#FFCC80',
//   '#90CAF9',
//   '#F48FB1',
//   '#BDBDBD',
//   '#FFB6C1',
//   '#C8E6C9',
//   '#FF80CC',
//   '#FFEB3B',
//   '#FF6F00',
// ];

// bright
// export const colorScheme = [
//   '#FFC107',
//   '#FF4081',
//   '#00BCD4',
//   '#4CAF50',
//   '#F44336',
//   '#9C27B0',
//   '#FF5722',
//   '#03A9F4',
//   '#E91E63',
//   '#8BC34A',
//   '#673AB7',
//   '#FF9800',
// ];

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

export const introText = `The Data Visualization Society (DVS) has held the annual State of the Industry survey since 2017. 
  Its purpose is to record & understand the status of the field through various lenses such as 
  job roles, demographics and challenges faced. While the survey has been finetuned over the years, 
  a few questions have been consistently asked, allowing us to look at the evolution of certain 
  aspects of this blossoming field. This visualization presents the evolution of tools & 
  technologies used by data viz practitioners, focusing only on tools with more than 
  30 total users (250 on mobile) from 2017 to 2022. In essence, this is a 
  dynamic data portrait of the DVS, seen through the lens of the tools we use.`;

export const howToRead = 'HOW TO UNDERSTAND THIS VISUALIZATION';

// touch on: each ring, each arc. Order rings inside out by... Touch on controversy of pie chart.
// questions this viz can help us answer.
export const howToReadText =
  //'';
  `Each ring represents one year's responses to what tools/technologies respondents
use to visualize data. The angle of each colored arc
represents the fraction of all tool usage that year that is made up by a specific tool.
Rings can be ordered (from innermost to outermost) by the sample size - total tool usage
that year (keep in mind this is different from number of respondents, as a respondent can
select multiple tools per year) - or by year.

Ordering rings linearly by sample size fits nicely with this dataset of different sample sizes per year. 
This is because an outer ring with the same percentage usage as an inner ring, but a bigger sample
size will rightfully appear bigger as the absolute number of users is bigger in a larger sample size.
However, sample size does not increase every year and an important goal of this visualization is to
see how tool usage changes over time. When equally spaced by year, each ring's width becomes proportional
to the total tool usage that year. This compromises by allowing for comparison over time,
while still giving some sense of different tool usage/sample size between years.

What tools are used most each year? Which has gained/declined most in popularity over time?
How has a specific tool's usage changed over time? Arcs/tools within each year can be sorted
to answer questions like these and more.`;

// The width of each ring is constant when
// ordered by sample size, as outer rings do indeed have a larger sample size than inner ones
// & therefore
// (yes, we know how controversial comparison by angle is). But when ordered by
// year, each ring's width is proportional to the number of respondents of
// that year (check). This compromises by allowing for comparison over time,
// while still giving some sense of different usage/sample size over the years.";
