
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
heatMapConfig.margin.right = 20;
heatMapConfig.margin.bottom = 20;
heatMapConfig.margin.left = 180;

heatMapConfig.plot.x = heatMapConfig.margin.left;
heatMapConfig.plot.y = heatMapConfig.margin.top;
heatMapConfig.plot.width = heatMapConfig.svg.width - heatMapConfig.margin.left - heatMapConfig.margin.right;
heatMapConfig.plot.height = heatMapConfig.svg.height - heatMapConfig.margin.top - heatMapConfig.margin.bottom;

console.log("heatMapConfig:", heatMapConfig);
console.log("heatMapConfig.svg:", heatMapConfig.svg);
// heatMapSVG.attr("width", width);
// heatMapSVG.attr("height", height);

// setup svg
let heatMapSVG = d3.select("body").select("svg#myHeatMap");
heatMapSVG.attr('width', heatMapConfig.svg.width);
heatMapSVG.attr('height', heatMapConfig.svg.height);

console.log("heatMapSVG:", heatMapSVG);

// setup plot area
let heatMapPlot = heatMapSVG.append('g');
heatMapPlot.attr('id', 'plot');
heatMapPlot.attr('transform', translate(heatMapConfig.plot.x, heatMapConfig.plot.y));

// use a rect to illustrate plot area
let rect = heatMapPlot.append('rect');
rect.attr('id', 'background');

rect.attr('x', 0);
rect.attr('y', 0);
rect.attr('width', heatMapConfig.plot.width);
rect.attr('height', heatMapConfig.plot.height);

// scales for data
let heatMapScale = {};

heatMapScale.x = d3.scaleLinear();
heatMapScale.x.range([0, heatMapConfig.plot.width]);

heatMapScale.y = d3.scaleBand();
heatMapScale.y.range([heatMapConfig.plot.height, 0]);

let heatMapAxis = {};  // axes for data
heatMapAxis.x = d3.axisBottom(heatMapScale.x);
heatMapAxis.x.tickPadding(0);

heatMapAxis.y = d3.axisLeft(heatMapScale.y);
heatMapAxis.y.tickPadding(0);

// https://github.com/d3/d3-scale-chromatic
heatMapScale.color = d3.scaleSequential(d3.interpolatePuOr);

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


  heatMapScale.x.domain(zParMedian);
  heatMapScale.y.domain(tiernames);
  console.log("heatMapScale's X:", heatMapScale);

  //already set up y scales

  // draw the x and y axis
 let gx = heatMapSVG.append("g");
 gx.attr("id", "x-axis");
 gx.attr("class", "axis");
 gx.attr("transform", translate( heatMapConfig.plot.x,  heatMapConfig.plot.y + heatMapConfig.plot.height));
 gx.call(heatMapAxis.x);

 let gy = heatMapSVG.append("g");
 gy.attr("id", "y-axis");
 gy.attr("class", "axis");
 gy.attr("transform", translate( heatMapConfig.plot.x, heatMapConfig.plot.y));
 gy.call(heatMapAxis.y);


 // get all of the value objects (with date and value) from the rows
 /*
data = [
  {
    tierName: "Four Year",
    parMedian: [many values],
    femaleRatio: [many values],
    standardizedParMedian: [many values],
    standardizedFemaleRatio: [many values]},

  {
    tierName: "2 Year",
    parMedian: [],...

  }


]
 */
 let myValues = [];
 let myParMedian = [];
 console.log("data", data);
 data.forEach((object, i) => {
   console.log("object", object);

    // console.log("object.zFemaleRatio:", object.standardizedParMedian);
    object.standardizedFemaleRatio.forEach((myZFemaleRatio, i) => {
      myValues.push(myZFemaleRatio);
    });

    object.standardizedParMedian.forEach((myZParMedian, i) => {
      myParMedian.push(myZParMedian)
    });


    // myValues.push(object.standardizedFemaleRatio);

 });
 // myValues = [many zFemaleRatio values]
 // heatMapScale.x.domain(myParMedian); it's now 1 array
 console.log("myParMedian", myParMedian);
 // console.log("heatmapScale:", heatMapScale.x);
 // console.log("myValues", myValues);
 /*
 myValues = [many values of z-score female ratio]
 */

 // calculate the min, max, and median
  let min = d3.min(myValues);
  let max = d3.max(myValues);
  let mid = d3.mean(myValues);

  heatMapScale.color.domain([min, mid, max]);

  // create one group per row
 let rows = heatMapPlot.selectAll("g.cell")
   .data(data)
   .enter()
   .append("g");

  rows.attr("class", "cell");
  rows.attr("id", d => "tierName" + d.tierName);
  console.log("rows", rows);

  // shift the entire group to the appropriate y-location
 rows.attr("transform", function(d) {
   return translate(0, heatMapScale.y(d["tierName"]));
 });

 // create one rect per cell within row group
  let cells = rows.selectAll("rect")
    .data(d => d.standardizedFemaleRatio)
    .enter()
    .append("rect");

  console.log("cells:", cells);
  // looks like every standardizedFemaleRatio has a rect..

  cells.attr("x", d => heatMapScale.x(d.standardizedParMedian));
  cells.attr("y", 0); // handled by group transform
  cells.attr("width", 2);
  cells.attr("height", 2);

  // cells.attr("width", heatMapScale.x.bandwidth());
  // cells.attr("height", heatMapScale.y.bandwidth());

  // here is the color magic!
  cells.style("fill", d => heatMapScale.color(d.standardizedFemaleRatio));
  cells.style("stroke", d => heatMapScale.color(d.standardizedFemaleRatio));

}

  // Build X scales and axis:
// console.log("Before building x sclaes");
// let scale = {}
//  scale.x = d3.scaleLinear()
//     .range([0, width]);
    //.domain([-3, 3.5]); // from tableau
    // .padding(0.01);

// heatMapSVG.append("g")
//     .attr("transform", translate(0, height))
//     .call(d3.axisBottom(x));


// format the tick labels
// axis.x.tickFormat(dateFormatter);
// axis.y.tickFormat(regionFormatter);

// heatMapSVG.append("g")
//   .call(d3.axisLeft(heatMapScale.y));



  // values provided by Tableau

// chart title
drawBigTitle();
// Draws a title for whole plot
// help: http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
function drawBigTitle() {
  heatMapSVG.append("text")
        .attr("x", (width / 2))
        .attr("y",  (margin.top / 2) + 7) // dam the title is waaay to high
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        // .style("text-decoration", "underline")
        .text("Standardized Parents' Median and Female Ratio\t");
}

// heatMapPlot.append("g").append("text")
//      // .attr("x", (plotWidth / 2) + margin.left - 50)
//      .attr("x", (width / 2) + margin.left)
//      .attr("y", margin.top)
//      .attr("text-anchor", "middle")
//      .style("font-size", "24px")
//      .text("Map title");


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
