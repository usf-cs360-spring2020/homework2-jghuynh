const width = 960;
const height = 500;

const margin = {
  top: 10,
  bottom: 35,
  left: 45,
  right: 15,
  // background: "whitesmoke"
};

console.log("Beginning");
const svg = d3.select("svg#myHeatMap");
console.assert(svg.size() == 1);
console.log("Before appending svg");
// help from:
// https://www.d3-graph-gallery.com/graph/heatmap_basic.html

// append the svg object to the body of the page
svg
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", translate(margin.left, margin.top);

  // add plot region
  const plot = svg.append("g").attr("id", "plot");


  // Build X scales and axis:
  console.log("Before building x sclaes");
  var x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.01);
  svg.append("g")
    .attr("transform", translate(0, height)
    .call(d3.axisBottom(x))

// chart title
svg.append("g").append("text")
     // .attr("x", (plotWidth / 2) + margin.left - 50)
     .attr("x", (width / 2) + margin.left)
     .attr("y", margin.top)
     .attr("text-anchor", "middle")
     .style("font-size", "24px")
     .text("Wowow");
console.log("After title");

/*
 * returns a translate string for the transform attribute
 */
function translate(x, y) {
  return 'translate(' + String(x) + ',' + String(y) + ')';
}
