(function () {
  main = {};

  const selectElement = document.querySelector(".file_inputSelect");

  //Load Data and Render a View
  selectElement.addEventListener("change", (event) => {
    const fileSelected = event.target.value;
    if (fileSelected.endsWith(".tsv")) {
      processTSVData(fileSelected);
    }
  });

  // Creating a global menu for charts
  // This is where all the global level views will be configured
  main.createMainController = function () {
    if(!window.currentSessionStorage.globalMenuLoaded)
    {
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
    window.currentSessionStorage.globalMenuLoaded = true;
    }

  };

  //Code to add a new panel  
  main.addNewPanel = function () {
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
