const width = 960;
const height = 500;

const margin = {
  top: 10,
  bottom: 35,
  left: 45,
  right: 15
};

const svg = d3.select("svg#bubble");
console.assert(svg.size() == 1);

// set svg size
svg.attr("width", width);
svg.attr("height", height);

// add plot region
const plot = svg.append("g").attr("id", "plot");

// Set up scales
const scales = {
  x: d3.scaleLinear(),
  y: d3.scaleLinear(),
  // do not linearly scale radius...
  // area = pi * r * r, so use sqrt of r!
  r: d3.scaleSqrt(),
  fill: d3.scaleDiverging(d3.interpolatePiYG)
};

//  The domains
scales.x.range([0, width - margin.left - margin.right - 150]);
// need to subtract 250 because, need more horizontal space
// for the legend to take up.
// We don't want the legend to actually be on the chart.
scales.x.domain([0, 13]);
scales.y.range([height - margin.top - margin.bottom, 0]);
scales.y.domain([0, 1]); // female ratio from 0 to 1

// TODO: change these later
// messes with the ranges of what r = radius can be
scales.r.range([1, 12]).domain([0, 9000]);
// the domain of the colors
scales.fill.domain([10300, (10300 + 85800)/2, 85800]);

// drawing axes
drawAxis();
drawTitles();
drawColorLegend();
// drawCircleLegend();
drawBigTitle();

/*
 * create axis lines
 */
function drawAxis() {
  // place the xaxis and yaxis in their own groups
  const xGroup = svg.append('g').attr('id', 'x-axis').attr('class', 'axis');
  const yGroup = svg.append('g').attr('id', 'y-axis').attr('class', 'axis');

  // create axis generators
  const xAxis = d3.axisBottom(scales.x);
  const yAxis = d3.axisLeft(scales.y);

  // https://github.com/d3/d3-format#locale_formatPrefix
  xAxis.ticks(14, 's').tickSizeOuter(0);
  yAxis.ticks(10).tickSizeOuter(0);

  // shift x axis to correct location
  xGroup.attr('transform', translate(margin.left, height - margin.bottom));
  xGroup.call(xAxis);

  // shift y axis to correct location
  yGroup.attr('transform', translate(margin.left, margin.top))
  yGroup.call(yAxis);
}

/*
 * draw axis titles
 */
function drawTitles() {
  const xMiddle = margin.left + midpoint(scales.x.range());
  const yMiddle = margin.top + midpoint(scales.y.range());

  // test middle calculation
  // svg.append("circle").attr("cx", xMiddle).attr("cy", yMiddle).attr("r", 5);

  const xTitle = svg.append('text')
    .attr('class', 'axis-title')
    .text('Tier');

  xTitle.attr('x', xMiddle);
  xTitle.attr('y', height);
  xTitle.attr('dy', -4);
  xTitle.attr('text-anchor', 'middle');

  // it is easier to rotate text if you place it in a group first
  // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate

  const yGroup = svg.append('g');

  // set the position by translating the group
  yGroup.attr('transform', translate(4, yMiddle));

  const yTitle = yGroup.append('text')
    .attr('class', 'axis-title')
    .text('Female Ratio');

  // keep x, y at 0, 0 for rotation around the origin
  yTitle.attr('x', 0);
  yTitle.attr('y', -4);

  yTitle.attr('dy', '1.75ex');
  yTitle.attr('text-anchor', 'middle');
  yTitle.attr('transform', 'rotate(-90)');
}

function drawColorLegend() {
  const legendWidth = 140;
  const legendHeight = 20;

  // place legend in its own group
  const group = svg.append('g').attr('id', 'color-legend');

  // shift legend to appropriate position
  group.attr('transform', translate(width - margin.right - legendWidth, margin.top));

  const title = group.append('text')
    .attr('class', 'axis-title')
    .attr("y", 5) // sorry, shift color legend title down by 5 just
    // to make room for the title...
    .text("Kids' Median Salaries");

  title.attr('dy', 12)
  .attr("fontsize", "6px");

  // lets draw the rectangle, but it won't have a fill just yet
  const colorbox = group.append('rect')
    .attr('x', 0)
    .attr('y', 12 + 6)
    .attr('width', legendWidth)
    .attr('height', legendHeight);

  // we need to create a linear gradient for our color legend
  // this defines a color at a percent offset
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient

  // this is easier if we create a scale to map our colors to percents

  // get the domain first (we do not want the middle value from the diverging scale)
  const colorDomain = [d3.min(scales.fill.domain()), d3.max(scales.fill.domain())];

  // add a new scale to go from color tick to percent
  scales.percent = d3.scaleLinear()
    .range([0, 100])
    .domain(colorDomain);

  // we have to first add gradients
  const defs = svg.append('defs');

  // add a color stop per data tick
  // input  (ticks)   : [-20, ..., 15, ..., 50]
  // output (percents): [  0, ..., 50, ..., 100]
  defs.append('linearGradient')
    .attr('id', 'gradient')
    .selectAll('stop')
    .data(scales.fill.ticks())
    .enter()
    .append('stop')
    .attr('offset', d => scales.percent(d) + '%')
    .attr('stop-color', d => scales.fill(d));

  // draw the color rectangle with the gradient
  colorbox.attr('fill', 'url(#gradient)');

  // now we need to draw tick marks for our scale
  // we can create a legend that will map our data domain to the legend colorbox
  scales.legend = d3.scaleLinear()
    .domain(colorDomain)
    .range([0, legendWidth]);

  // i tend to keep scales global so i can debug them in the console
  // in this case there really is no need for the percent and legend scales
  // to be accessible outside of this function

  const legendAxis = d3.axisBottom(scales.legend)
    .tickValues(scales.fill.domain())
    .tickSize(legendHeight)
    .tickSizeOuter(0);

  const axisGroup = group.append('g')
    .attr('id', 'color-axis')
    .attr('transform', translate(0, 12 + 6))
    .call(legendAxis);

  // now lets tighten up the tick labels a bit so they don't stick out
  axisGroup.selectAll('text')
    .each(function(d, i) {
      // set the first tick mark to anchor at the start
      if (i == 0) {
        d3.select(this).attr('text-anchor', 'start');
      }
      // set the last tick mark to anchor at the end
      else if (i == legendAxis.tickValues().length - 1) {
        d3.select(this).attr('text-anchor', 'end');
      }
    });

  // note how many more lines of code it took to generate the legend
  // than the base visualization!
}

/*
 * this demonstrates d3-legend for creating a circle legend
 * it is made to work with d3v4 not d3v5 however
 */
function drawCircleLegend() {
  const legendWidth = 200;
  const legendHeight = 20;
  // What I know: I'm inside

  // place legend into its own group
  const group = svg.append('g').attr('id', 'circle-legend');

  // position legend
  group.attr('transform', translate(width - margin.right - legendWidth, margin.top + 75))
  // https://d3-legend.susielu.com/#size-linear
  const legendSize = d3.legendSize()
    .scale(scales.r)
    .shape('circle')
    .cells(5) // I think we want 5 circles
    .ascending(true)
    .shapePadding(5) // space between each circle
    .labelOffset(10) // how far away between labels and circles
    .labelFormat("d")
    .title('Class Size')
    .orient('vertical');

  group.call(legendSize);

  // fix the title spacing
  group.select('text.legendTitle').attr('dy', -7);

  // note it is harder to get this to be two column using this package
  // we have to select what was drawn and then move it around
}

// Draws a title for whole plot
// help: http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
function drawBigTitle() {
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y",  (margin.top / 2 + 9)) // dam the title is waaay to high
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        // .style("text-decoration", "underline")
        .text("Female Ratios And Kids' Median Salaries Among Different College Tiers And Class Sizes");
}

// loading dataset
d3.csv("CAselectedCols.csv", convertRow).then(draw);

/**
Converts each row into either an integer or a float or a string
*/
function convertRow(row) {

  let keep = {};
  keep.name = row["name"];
  keep.type = +row["type"];
  keep.tier = +row["tier"];
  keep.cohortCount = +row["count"];
  keep.kidsMedian = +row["k_median"];
  keep.parentMedian = +row["par_median"];
  keep.femaleRatio = parseFloat(row["female"]);

  return keep;
}

function draw(data) {
  console.log(data);
  // Okay I could have filtered for only CA colleges by writing
  // data = data.filter(row => row.state === "CA");
  // but whatever

  // so bigger circles are under smaller circles
  data.sort((a, b) => b.count - a.count);
  drawBubble(data);
}

/*
 * draw bubbles
 */
function drawBubble(data) {
  // place all of the bubbles in their own group
  const group = plot.append('g').attr('id', 'bubbles');

  const bubbles = group.selectAll('circle')
    .data(data)
    .enter()
    .append('circle');

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  bubbles.attr('cx', d => scales.x(d.tier));
  // bubbles.attrs("cx", d => d.tier);
  bubbles.attr('cy', d => scales.y(d.femaleRatio));
  bubbles.attr('r',  d => scales.r(d.cohortCount));

  bubbles.style('stroke', 'white');
  bubbles.style('fill', d => scales.fill(d.kidsMedian));
}

/*
 * calculates the midpoint of a range given as a 2 element array
 */
function midpoint(range) {
  return range[0] + (range[1] - range[0]) / 2.0;
}

/*
 * returns a translate string for the transform attribute
 */
function translate(x, y) {
  return 'translate(' + String(x) + ',' + String(y) + ')';
}
