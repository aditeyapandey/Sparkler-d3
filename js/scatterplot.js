// set the dimensions and margins of the graph
(function () {
  plotter = {};

  plotter.render = function (finalData,plot, xField, yField, colorField) {
      const data = finalData.jsonData;
      // Add X axis
      x = d3
        .scaleLinear()
        .domain(d3.extent(data.map((val) => parseFloat(val[xField]))))
        .range([0, plot.width]);
      plot.svg
        .append("g")
        .attr("transform", `translate(0, ${plot.height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      y = d3
        .scaleLinear()
        .domain(d3.extent(data.map((val) => parseFloat(val[yField]))))
        .range([plot.height, 0]);
      plot.svg.append("g").call(d3.axisLeft(y));

      //Add Labels
      const xAxisLabel = plot.svg
        .append("g")
        .attr("id", "xAxisLabel")
        .attr("transform", `translate(0, ${plot.height})`);

      const yAxisLabel = plot.svg.append("g").attr("id", "yAxisLabel");
      xAxisLabel
        .append("text")
        .attr("class", "axis-label")
        .attr("x", plot.width / 2)
        .attr("y", 35)
        .text(xField);

      yAxisLabel
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -plot.height / 2)
        .attr("y", -30)
        .attr("transform", `rotate(-90)`)
        .style("text-anchor", "middle")
        .text(yField);

      // Color scale: give me a specie name, I return a color
      color = d3
        .scaleOrdinal()
        .domain(["ctrl", "stim"])
        .range(["#440154ff", "#21908dff"]);

      // Add dots
      plot.svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", function (d) {
          return `dot  + ${d[colorField]}`;
        })
        .attr("cx", function (d) {
          return x(d[xField]);
        })
        .attr("cy", function (d) {
          return y(d[yField]);
        })
        .attr("r", 2)
        .style("fill", function (d) {
          return color(d[colorField]);
        })

      plotter.createLegend(plot.visContainerId, color);
  };

  plotter.createLegend = function (divId, color) {
    // Highlight
    const highlight = function (event, d) {
      const selected = d;

      d3.select("#" + divId)
        .selectAll(".dot")
        .transition()
        .duration(200)
        .style("opacity", 0.1)
        .attr("r", 2);

      d3.select("#" + divId)
        .selectAll("." + selected)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("r", 2);
    };

    // Unhighlibht
    const doNotHighlight = function (event, d) {
      d3.select("#" + divId)
        .selectAll(".dot")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("r", 2);
    };
    const legend = d3
      .select("#" + divId)
      .append("div")
      .attr("class", "legend  d-flex justify-content-center")
      .style("height", "30px");

    legend.append("span").text("Legend:").attr("class", "btn-light m-3 legendText")
  

    legend
      .selectAll("viewLegend")
      .data(color.domain())
      .join("span")
      .attr("class", "btn-light m-3 legendText")
      .text((d) => d)
      .style("color", (d) => color(d))
      .on("mouseover", highlight)
      .on("mouseout", doNotHighlight);;
  };

  plotter.initializeChart = function (
    visContainerId,
    containerWidth,
    containerHeight
  ) {
    //Variables
    let svg;
    let width, height;
    let x, y, color;
    let margin = { top: 10, right: 30, bottom: 50, left: 60 };

    width = containerWidth - margin.left - margin.right;
    height = containerHeight - margin.top - margin.bottom;

    widthForSvg = width + margin.left + margin.right;
    heightForSvg = height + margin.top + margin.bottom;

    svg = d3
      .select("#" + visContainerId)
      .append("svg")
      .attr("viewBox", `0 0 ${widthForSvg} ${heightForSvg}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    return { svg, width, height, x, y, color, visContainerId };
  };
})();
