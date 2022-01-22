(function () {
  panel = {};
  panelCounter = 0;

  panel.addView = function () {
    const currentPanelId = "dataviz" + panelCounter;
    let div = d3
      .select(".visualizationContainer")
      .select(".containerRow")
      .append("div")
      .attr("id", currentPanelId)
      .attr("class", "col-4");
    div
      .append("div")
      .attr("class", "legend container justify-content-center")
      .style("max-height", "100%");
    panelCounter++;
    return currentPanelId;
  };

  panel.removeAll = function () {
    d3.select(".visualizationContainer")
      .select(".containerRow")
      .selectAll("*")
      .remove();
    panelCounter = 0;
  };

  panel.createControlPanel = function (id, data) {
    const containerDiv = d3
      .select("#" + id)
      .append("div")
      .attr("class", "container input-group mb-3");
    const dataForQuant = data.controllerData.quantitative;
    const dataForCat = data.controllerData.categorical;

    //X Field
    containerDiv
      .append("div")
      .attr("class", "input-group-prepend")
      .append("span")
      .attr("class", "input-group-text")
      .text("X");
    const selectX = containerDiv
      .append("select")
      .attr("id", id + "_x")
      .attr("class", "custom-select")
      .on("change", onchange);
    selectX
      .selectAll("option")
      .data(dataForQuant)
      .join("option")
      .attr("value", (d) => d)
      .text(function (d) {
        return d;
      });

    //Y Field
    containerDiv
      .append("div")
      .attr("class", "input-group-prepend")
      .append("span")
      .attr("class", "input-group-text")
      .text("Y");
    const selectY = containerDiv
      .append("select")
      .attr("id", id + "_y")
      .attr("class", "custom-select")
      .on("change", onchange);
    selectY
      .selectAll("option")
      .data(dataForQuant)
      .join("option")
      .attr("value", (d) => d)
      .text(function (d) {
        return d;
      });

    //Group Field
    containerDiv
      .append("div")
      .attr("class", "input-group-prepend")
      .append("span")
      .attr("class", "input-group-text")
      .text("Group");
    const selectG = containerDiv
      .append("select")
      .attr("id", id + "_color")
      .attr("class", "custom-select")
      .on("change", onchange);
    selectG
      .selectAll("option")
      .data(dataForCat)
      .join("option")
      .attr("value", (d) => d)
      .text(function (d) {
        return d;
      });
  };

  function onchange() {
    let variableToUpdate = d3.select(this).attr("id").split("_")[1];
    console.log(d3.select(this).attr("id"))
    let updatedValue = d3.select(this).property("value");
    let idOfRelatedDiv = d3.select(this).attr("id").split("_")[0];
    let plotVars =
      window.currentSessionStorage.viewInformation[idOfRelatedDiv].plotVars;
    
    plotVars[variableToUpdate]  =  updatedValue
    d3.select("#" + plotVars.visContainerId)
      .select("svg")
      .selectAll("g")
      .selectAll("*")
      .remove();
    d3.select("#" + plotVars.visContainerId)
      .select("svg")
      .selectAll(".axis")
      .select("*")
      .remove();
      d3.select("#" + plotVars.visContainerId)
      .select(".legend")
      .select("*")
      .remove();
    let data = window.currentSessionStorage.data.resultData;
    plotter.render(data, plotVars);
  }
})();
