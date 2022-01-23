// set the dimensions and margins of the graph
(function () {
  plotter = {};

  plotter.render = function (finalData, plot) {
    const data = finalData.jsonData;
    const colorFieldDomain = [...finalData.metaData[plot.color].range];
    const colorRange = finalData.metaData[plot.color].colorMap;

    // Add X axis
    let x = d3
      .scaleLinear()
      .domain(d3.extent(data.map((val) => parseFloat(val[plot.x]))))
      .range([0, plot.width]);
    let xAxis = plot.svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${plot.height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3
      .scaleLinear()
      .domain(d3.extent(data.map((val) => parseFloat(val[plot.y]))))
      .range([plot.height, 0]);
    let yAxis = plot.svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

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
    let color = d3.scaleOrdinal().domain(colorFieldDomain).range(colorRange);

    // Add dots
    let circles = plot.svg
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
      });

    // Add brushing
    plot.svg.call(
      d3
        .brush() // Add the brush feature using the d3.brush function
        .extent([
          [0, 0],
          [plot.width, plot.height],
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    );

    function updateChart(brush) {
      extent = brush.selection;
      d3.selectAll("circle").classed("selected", function (d) {
        return isBrushed(extent, x(d[plot.x]), y(d[plot.y]));
      });
    }
    function isBrushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
    }

    // // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    // var zoom = d3
    //   .zoom()
    //   .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
    //   .extent([
    //     [0, 0],
    //     [plot.width, plot.height],
    //   ])
    //    .on("zoom", updateChart);

    // // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    // plot.svg.append("rect")
    //   .attr("width", plot.width)
    //   .attr("height", plot.height)
    //   .style("fill", "none")
    //   .style("pointer-events", "all")
    //   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .call(zoom);

    //   function updateChart() {

    //     // recover the new scale
    //     var newX = d3.event.transform.rescaleX(x);
    //     var newY = d3.event.transform.rescaleY(y);

    //     // update axes with these new boundaries
    //     xAxis.call(d3.axisBottom(newX))
    //     yAxis.call(d3.axisLeft(newY))

    //     // update circle position
    //     scatter
    //       .selectAll("circle")
    //       .attr('cx', function(d) {return newX(d.Sepal_Length)})
    //       .attr('cy', function(d) {return newY(d.Petal_Length)});
    //   }

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

    const legend = d3.select("#" + divId).select(".legend");
    const legnedItem = legend.append("div").attr("class", "");

    legnedItem.append("span").text("Legend:").attr("class", "legendText");

    legnedItem
      .selectAll("viewLegend")
      .data(color.domain())
      .join("span")
      .attr("class", "btn-light m-1 legendText")
      .text((d) => "  " + d)
      .style("color", (d) => color(d))
      .on("mouseover", highlight)
      .on("mouseout", doNotHighlight);
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
