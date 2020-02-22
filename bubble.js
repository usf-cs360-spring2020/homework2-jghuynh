const width = 960;
const height = 500;

const margin = {
  top: 10,
  bottom: 35,
  left: 35,
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
scales.x.range([0, width - margin.left - margin.right]);
scales.x.domain([0, 13]);
scales.y.range([height - margin.top - margin.bottom, 0]);
scales.y.domain([0, 1]);


// loading dataset
myDataBubble = d3.csv("CAselectedCols", convertRow).then(draw);

function convertRow(row) {
  let keep = {};
  keep.name = row["name"];
  keep.type = +row["type"];
  keep.tier = +row["tier"];
  keep.cohortCount = +row["count"];
  keep.kidsMedian = +row["k_median"];
  keep.parentMedian = +row["par_median"];
  keep.femaleRatio = +row["female"];

  return keep;
}

function draw(data) {
  console.log("Hello!")
}


/*
 * returns a translate string for the transform attribute
 */
function translate(x, y) {
  return 'translate(' + String(x) + ',' + String(y) + ')';
}
