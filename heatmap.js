
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

dataset = d3.csv("CAselectedCols.csv", addToMap).then(toStandardize);
// anotherset = d3.csv("CAselectedCols.csv").then(function(data) {
//   console.log(anotherset);
// });
// });

// dataset.forEach( function (entry) {
console.log("dataset:", dataset);
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


    // heatmapData[myTierName].parMedian.push(entry.par_median);
    // heatmapData.femaleRatio.push(entry.female);
  //console.log("heatmapData", heatmapData);
  // console.log("heatmapData.parMedian", heatmapData.find(obj =>
  //   obj.parMedian > 0);
  // );
  //console.log("heatmapData[0]", heatmapData[0]);
  return heatmapData;
}

// });


// time to standardize
// for every object/tiername in
function toStandardize(heatmapData) {
  console.log("heatmapData in standardize: ", heatmapData);
  // for every object in heatmapData..
  console.log("heatmapData[0]", heatmapData[0]);
  heatmapData[0].forEach( function(object) {
    //console.log("object", object);
    console.log("object: ", object);
    //console.log("object.parMedian: ", heatmapData[0][0].parMedian);
    let avgParMedian = d3.mean(object.parMedian); //, function(d) {return d.value})
    let stdParMedian = d3.deviation(object.parMedian); //function(d) {return d.value})

    let avgFemaleRatio = d3.mean(object.femaleRatio);
    let stdFemaleRatio = d3.deviation(object.femaleRatio);

    // standardized Par Median
    // for every parMedian value
    object.parMedian.forEach( function(myParMedian) {
      console.log("myParMedian: ", myParMedian);
      /*
      new value = (parMedianValue - avgParMedian)/stdParMedian
      push new value into object.standardizedParMedian
      */
      // row.parMedian = (row.parMedian - avgParMedian)/stdParMedian
      zParMedian = (myParMedian - avgParMedian)/stdParMedian
      object.standardizedParMedian.push(zParMedian);
    }) // for Each parMedianValue


    object.femaleRatio.forEach( function(myFemaleRatio) {
      zFemaleRatio = (myFemaleRatio - avgFemaleRatio)/stdFemaleRatio
      object.standardizedFemaleRatio.push(zFemaleRatio);
    }) // for each female ratio
    console.log("Object: ", object);

  });
  console.log(heatmapData[0]);

}



  // Build X scales and axis:
console.log("Before building x sclaes");
var x = d3.scaleLinear();
x
    .range([0, width])
    .domain(-3, 3.5); // from tableau
    //.padding(0.01);

heatMapSVG.append("g")
    .attr("transform", translate(0, height))
    .call(d3.axisBottom(x));

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  //.domain(tiernames)
  .padding(0.01);

heatMapSVG.append("g")
  .call(d3.axisLeft(y));

const fill = d3.scaleDiverging(d3.interpolatePuOr)
  .domain([-3.5, 0, 3]);

  // values provided by Tableau

// chart title
heatMapPlot.append("g").append("text")
     // .attr("x", (plotWidth / 2) + margin.left - 50)
     .attr("x", (width / 2) + margin.left)
     .attr("y", margin.top)
     .attr("text-anchor", "middle")
     .style("font-size", "24px")
     .text("Wowow");
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
