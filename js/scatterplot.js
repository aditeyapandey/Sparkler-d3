// set the dimensions and margins of the graph
(function () {
  plotter = {};

  plotter.render = function (finalData,plot) {
      const data = finalData.jsonData;
      const colorFieldDomain = [...finalData.metaData[plot.color].range];
      const colorRange = finalData.metaData[plot.color].colorMap;

      // Add X axis
     let x = d3
        .scaleLinear()
        .domain(d3.extent(data.map((val) => parseFloat(val[plot.x]))))
        .range([0, plot.width]);
      plot.svg
        .append("g")
        .attr("class","axis")
        .attr("transform", `translate(0, ${plot.height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
     let y = d3
        .scaleLinear()
        .domain(d3.extent(data.map((val) => parseFloat(val[plot.y]))))
        .range([plot.height, 0]);
      plot.svg.append("g").attr("class","axis").call(d3.axisLeft(y));

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
        .text(plot.x);

      yAxisLabel
        .append("text")
        .attr("class", "axis-label")
        .attr("x", -plot.height / 2)
        .attr("y", -30)
        .attr("transform", `rotate(-90)`)
        .style("text-anchor", "middle")
        .text(plot.y);

      // Color scale: give me a specie name, I return a color
      let color = d3
        .scaleOrdinal()
        .domain(colorFieldDomain)
        .range(colorRange);

      // Add dots
      plot.svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", function (d) {
          return `dot  + ${d[plot.color]}`;
        })
        .attr("cx", function (d) {
          return x(d[plot.x]);
        })
        .attr("cy", function (d) {
          return y(d[plot.y]);
        })
        .attr("r", 2)
        .style("fill", function (d) {
          return color(d[plot.color]);
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
        .style("opacity", 0)
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
      .select(".legend")
      const legnedItem = legend.append("div").attr("class","")

      legnedItem.append("span").text("Legend:").attr("class", "legendText")
  

      legnedItem
      .selectAll("viewLegend")
      .data(color.domain())
      .join("span")
      .attr("class", "btn-light m-1 legendText")
      .text((d) => "  "+ d )
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
