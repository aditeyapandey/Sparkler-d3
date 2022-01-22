(function () {
  main = {};

  const selectElement = document.querySelector(".file_inputSelect");

  selectElement.addEventListener("change", (event) => {
    const fileSelected = event.target.value;
    if (fileSelected.endsWith(".tsv")) {
      processTSVData(fileSelected);
    }
  });

  main.createMainController = function () {
    let div = d3
      .select(".mainControllerPanel")
      .attr("class", "mainControllerPanel border border-light")
      .append("div")
      .attr(
        "class",
        "container-md input-group mb-3 d-flex align-items-center m-3"
      );
    div
      .append("div")
      .attr("class", "input-group-prepend")
      .append("button")
      .attr("id", "addPanel")
      .attr("class", "btn btn-outline-secondary")
      .text("Add Panel");

    d3.select("#addPanel").on("click", main.addNewPanel);
  };

  main.addNewPanel = function () {
    console.log("test")
    //Testing
    let data = window.currentSessionStorage.data.resultData;
    const id = panel.addView();
    const plotVars = plotter.initializeChart(id, 460, 400);
    //Define the variables
    plotVars.x = "tsne1";
    plotVars.y = "tsne1";
    plotVars.color = "stim";
    window.currentSessionStorage.viewInformation[id] = { plotVars: plotVars };
    plotter.render(data, plotVars);
    panel.createControlPanel(id, data);
  };
})();
