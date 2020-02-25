
console.log("width: ", width);
console.log()
// const width = 960;
// const height = 500;

// const margin = {
//   top: 10,
//   bottom: 35,
//   left: 45,
//   right: 15,
//   // background: "whitesmoke"
// };


const heatMapSVG = d3.select("svg#myHeatMap");
//console.assert(svg.size() == 1);
console.log("Before appending svg");
// help from:
// https://www.d3-graph-gallery.com/graph/heatmap_basic.html

// append the svg object to the body of the page
heatMapSVG
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", translate(margin.left, margin.top));

  // add plot region
const heatMapPlot = heatMapSVG.append("g").attr("id", "plot");


  // Build X scales and axis:
console.log("Before building x sclaes");
var x = d3.scaleBand()
    .range([0, width])
    .domain(0, 1)
    .padding(0.01);

heatMapSVG.append("g")
    .attr("transform", translate(0, height))
    .call(d3.axisBottom(x));

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);

heatMapSVG.append("g")
  .call(d3.axisLeft(y));

const fill = d3.scaleDiverging(d3.interpolatePuOr)
  .domain([0.0206, (0.0206 + 0.9946)/2,0.9946]);

  // values provided by Tableau

// chart title
plot.append("g").append("text")
     // .attr("x", (plotWidth / 2) + margin.left - 50)
     .attr("x", (width / 2) + margin.left)
     .attr("y", margin.top)
     .attr("text-anchor", "middle")
     .style("font-size", "24px")
     .text("Wowow");
console.log("After title");

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
  keep.tierName = row["tier_name"];
  keep.cohortCount = +row["count"];
  keep.kidsMedian = +row["k_median"];
  keep.parentMedian = +row["par_median"];
  keep.femaleRatio = parseFloat(row["female"]);
  console.log(keep.length);
  return keep;
}


/*
 * returns a translate string for the transform attribute
 */
function translate(x, y) {
  return 'translate(' + String(x) + ',' + String(y) + ')';
}


/*
function getAllTiernames

tiernames = []
heatmapData = [
  {
    tiername: "Four year for profit",
    parMedian: [MANY values],
    femaleRatio: [Many values]
  }
  {
    tiername: "2 year for profit",
    parMedian: [Many values],
    female: [Many values]
  }
  ...
]

dataset = d3.csv(CAselectedCols.csv)
heatmapData = []
tiernames = []

// entry = row
for each entry in dataset:
  let myTierName = entry.tier_name
  if !tiernames.contains(myTierName):
    tiernames.push(tiername)
    heatmap_data.push( {tierName: mytiername},
      {parMedian: [entry.par_median]}, {femaleRatio: [entry.female]})
  else
    heatmapData[entry.tier_name].values.push(entry.value)

// time to standardize
// for every object/tiername in
heatmapData.forEach( function(object)) {
  let avg = d3.mean(thing.parMedian), function(d) {return d.value})
  let std = d3.deviation(thing.parMedian), function(d) {return d.value})

  object.values.forEach(funcion(row)) {
  row.value = (row.value - avg)/std
}



}



*/
