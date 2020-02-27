
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

// configuration of svg/plot area
const heatMapConfig = {
  'svg': {},
  'margin': {},
  'plot': {}
};

heatMapConfig.svg.height = 450;
heatMapConfig.svg.width = heatMapConfig.svg.height * 1.618; // golden ratio

heatMapConfig.margin.top = 10;
heatMapConfig.margin.right = 10;
heatMapConfig.margin.bottom = 20;
heatMapConfig.margin.left = 80;

heatMapConfig.plot.x = heatMapConfig.margin.left;
heatMapConfig.plot.y = heatMapConfig.margin.top;
heatMapConfig.plot.width = heatMapConfig.svg.width - heatMapConfig.margin.left - heatMapConfig.margin.right;
heatMapConfig.plot.height = heatMapConfig.svg.height - heatMapConfig.margin.top - heatMapConfig.margin.bottom;

console.log("heatMapConfig:", heatMapConfig);
console.log("heatMapConfig.svg:", heatMapConfig.svg);
// heatMapSVG.attr("width", width);
// heatMapSVG.attr("height", height);

// setup svg
let heatMapSVG = d3.select('svg#myHeatMap');
heatMapSVG.attr('width', heatMapConfig.svg.width);
heatMapSVG.attr('height', heatMapConfig.svg.height);

console.log("heatMapSVG:", heatMapSVG);

// setup plot area
let heatMapPlot = svg.append('g');
plot.attr('id', 'plot');
plot.attr('transform', translate(heatMapConfig.plot.x, heatMapConfig.plot.y));
// help from:
// https://www.d3-graph-gallery.com/graph/heatmap_basic.html

// append the svg object to the body of the page


// heatMapSVG = d3.select("body")
// .select("svg#myHeatMap")
//   .attr("width", width + heatMapMargin.left + heatMapMargin.right)
//   .attr("height", height + heatMapMargin.top + heatMapMargin.bottom)
// .append("g")
//   .attr("transform", translate(heatMapMargin.left, heatMapMargin.top));


dataset = d3.csv("CAselectedCols.csv", addToMap)
  .then(toStandardize);

// anotherset = d3.csv("CAselectedCols.csv").then(function(data) {
//   console.log(anotherset);
// });
// });

// dataset.forEach( function (entry) {
//console.log("dataset:", dataset);
//dataset.forEach( addToMap);
heatmapData = [];
tiernames = [];
function addToMap (entry) {

  let myTierName = entry.tier_name;
  // if we have not seen this tier of school
  if (!tiernames.includes(myTierName)) {
    tiernames.push(myTierName);
    heatmapData.push(
      {
        tierName: myTierName,
        parMedian: [entry.par_median],
        femaleRatio: [entry.female],
        standardizedParMedian: [],
        standardizedFemaleRatio: []
      }
    );
    //console.log("Current tier", heatmapData.tierName);
    //console.log(heatmapData);
  }
  // if we have already seen this tier of school
  else {
    //heatmapData[myTierName].parMedian.push(entry.par_median);
    //heatmapData[myTierName].femaleRatio.push(entry.female);

    index = heatmapData.findIndex(item =>
      item.tierName == myTierName);
    //console.log("index:", index);
    //console.log(heatmapData[index]);
      //console.log("item in heatmapData: ", heatmapData.item.parMedian);
      heatmapData[index].parMedian.push(entry.par_median);
      heatmapData[index].femaleRatio.push(entry.female);
    };
  return heatmapData;
}


// time to standardize
// for every object/tiername in
function toStandardize(heatmapData) {
  // for every object in heatmapData..
  heatmapData = heatmapData[0];
  // so heatmapData is in a horrible format but whatever!
  heatmapData.forEach( function(object) {
    //console.log("object", object);

    //console.log("object.parMedian: ", heatmapData[0][0].parMedian
    let stdParMedian = 0;
    let stdFemaleRatio = 0;
    if (object.parMedian.length > 1) {
      stdParMedian = d3.deviation(object.parMedian); //function(d) {return d.value})
      stdFemaleRatio = d3.deviation(object.femaleRatio);
    }
    else {
      stdParMedian = 0.01;
      stdFemaleRatio = 0.01;
    }
    let avgParMedian = d3.mean(object.parMedian); //, function(d) {return d.value})


    let avgFemaleRatio = d3.mean(object.femaleRatio);


    if (stdFemaleRatio == 0) {
      stdFemaleRatio = 0.001; // please don't divide by 0
    }
    if (stdParMedian == 0) {
      stdParMedian = 0.001;
    }
    // console.log("avgParMedian", avgParMedian);
    if (object.tierName == "Ivy Plus") {
      console.log("avgParMedian", avgParMedian);
      console.log("avgFemaleRatio", avgFemaleRatio);
      console.log("stdFemaleRatio:", stdFemaleRatio);
      console.log("stdParMedian:", stdParMedian);
      // we know: zParMedian = zFemaleRatio = 0
    }


    // standardized Par Median
    // for every parMedian value
    object.parMedian.forEach( function(myParMedian) {
      /*
      new value = (parMedianValue - avgParMedian)/stdParMedian
      push new value into object.standardizedParMedian
      */
      // row.parMedian = (row.parMedian - avgParMedian)/stdParMedian
      zParMedian = (myParMedian - avgParMedian)/stdParMedian
      // console.log("zParMedian: ", zParMedian);
      object.standardizedParMedian.push(zParMedian);
    }) // for Each parMedianValue


    object.femaleRatio.forEach( function(myFemaleRatio) {
      zFemaleRatio = (myFemaleRatio - avgFemaleRatio)/stdFemaleRatio
      // console.log("zFemaleRatio: ", zFemaleRatio);
      object.standardizedFemaleRatio.push(zFemaleRatio);
    }) // for each female ratio
    //console.log("Object: ", object);
    // TODO: drawfunciton
  });
  //console.log(heatmapData[0]);
  console.log("Before drawing data..");
  draw(heatmapData);

}

function draw(data) {
  drawHeatMap(data);
}

function drawHeatMap(data) {
  console.log("Inside drawHeatMap");


  console.log("data: ", data);
  console.log("data[0]", data[0]);
  // scales.x.domain(data.standardizedParMedian)
  let zParMedian = data.map(row => row["standardizedParMedian"]);
  console.log("zParMedian:", zParMedian);

  //already set up y scales

  // draw the x and y axis
 let gx = svg.append("g");
 gx.attr("id", "x-axis");
 gx.attr("class", "axis");
 gx.attr("transform", translate( heatMapConfig.plot.x,  heatMapConfig.plot.y +  heatMapConfig.plot.height));
 gx.call(axis.x);

 let gy = svg.append("g");
 gy.attr("id", "y-axis");
 gy.attr("class", "axis");
 gy.attr("transform", translate( heatMapConfig.plot.x, heatMapConfig.plot.y));
 gy.call(axis.y);



}

  // Build X scales and axis:
console.log("Before building x sclaes");
let scale = {}
 scale.x = d3.scaleLinear()
    .range([0, width]);
    //.domain([-3, 3.5]); // from tableau
    // .padding(0.01);

// heatMapSVG.append("g")
//     .attr("transform", translate(0, height))
//     .call(d3.axisBottom(x));

// Build X scales and axis:

scale.y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(tiernames)
  .padding(0.01);

scale.fill = d3.scaleDiverging(d3.interpolatePuOr)
    .domain([-3.5, 0, 3]);

let axis = {};  // axes for data
axis.x = d3.axisBottom(scale.x);
axis.x.tickPadding(0);

axis.y = d3.axisLeft(scale.y);
axis.y.tickPadding(0);

// format the tick labels
// axis.x.tickFormat(dateFormatter);
// axis.y.tickFormat(regionFormatter);

heatMapSVG.append("g")
  .call(d3.axisLeft(scale.y));



  // values provided by Tableau

// chart title
heatMapPlot.append("g").append("text")
     // .attr("x", (plotWidth / 2) + margin.left - 50)
     .attr("x", (width / 2) + margin.left)
     .attr("y", margin.top)
     .attr("text-anchor", "middle")
     .style("font-size", "24px")
     .text("");
console.log("After title");

// // loading dataset
// d3.csv("CAselectedCols.csv", convertRow).then(draw);
//
// /**
// Converts each row into either an integer or a float or a string
// */
// function convertRow(row) {
//
//   let keep = {};
//   keep.name = row["name"];
//   keep.type = +row["type"];
//   keep.tier = +row["tier"];
//   keep.tierName = row["tier_name"];
//   keep.cohortCount = +row["count"];
//   keep.kidsMedian = +row["k_median"];
//   keep.parentMedian = +row["par_median"];
//   keep.femaleRatio = parseFloat(row["female"]);
//   console.log(keep.length);
//   return keep;
// }




//
//
// function getAllTiernames()
//
// tiernames = []
// heatmapData = [
//   {
//     tiername: "Four year for profit",
//     parMedian: [MANY values],
//     femaleRatio: [Many values]
//   }
//   {
//     tiername: "2 year for profit",
//     parMedian: [Many values],
//     female: [Many values]
//   }
//   ...
// ]
//
// dataset = d3.csv(CAselectedCols.csv)
// heatmapData = []
// tiernames = []
//
// // entry = row
// dataset.forEach(entry):
//   let myTierName = entry.tier_name
//   if !tiernames.contains(myTierName):
//     tiernames.push(tiername)
//     heatmap_data.push( {tierName: mytiername},
//       {parMedian: [entry.par_median]}, {femaleRatio: [entry.female]})
//   else
//     heatmapData[entry.tier_name].values.push(entry.value)
//
// // time to standardize
// // for every object/tiername in
// heatmapData.forEach( function(object)) {
//   let avg = d3.mean(thing.parMedian), function(d) {return d.value})
//   let std = d3.deviation(thing.parMedian), function(d) {return d.value})
//
//   object.values.forEach(funcion(row)) {
//   row.value = (row.value - avg)/std
// }
//
//
//
// }
console.log("end of heatmap.js!");
/*
 * returns a translate string for the transform attribute
 */
function translate(x, y) {
  return 'translate(' + String(x) + ',' + String(y) + ')';
}
