// set the dimensions and margins of the graph
(function () {
  plot = {};

  //Variables
  let svg;
  let width, height;
  let x,y,color;

  plot.render = function (xField,yField,colorField) {
    //Read the data
    d3.tsv("data/GSE96583_batch2.sub.tsv").then(function (data) {
        console.log(data);
      // Add X axis
      x = d3.scaleLinear().domain(d3.extent(data.map(val=>parseFloat(val[xField])))).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      y = d3.scaleLinear().domain(d3.extent(data.map(val=>parseFloat(val[yField])))).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      // Color scale: give me a specie name, I return a color
      color = d3
        .scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#440154ff", "#21908dff", "#fde725ff"]);

      // Add dots
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
          return x(d[xField]);
        })
        .attr("cy", function (d) {
          return y(d[yField]);
        })
        .attr("r", 5);
      //   .style("fill", function (d) { return color(d.Species) } )
    });
  };

  plot.initializeChart = function (
    visContainerId,
    containerWidth,
    containerHeight
  ) {
    let margin = { top: 10, right: 30, bottom: 30, left: 60 };

    width = containerWidth - margin.left - margin.right;
    height = containerHeight - margin.top - margin.bottom;

    svg = d3
      .select("#" + visContainerId)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  };
})();
