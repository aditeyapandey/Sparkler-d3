(function(){

    panel = {};
    panelCounter = 0;

    panel.addView = function()
    {
        const currentPanelId = "my_dataviz"+panelCounter;
        d3.select(".visualizationContainer").select(".containerRow").append("div").attr("id",currentPanelId).attr("class","col-4");
        panelCounter++;
        return currentPanelId;
    }

    panel.removeAll = function()
    {
        d3.select(".visualizationContainer").select(".containerRow").selectAll("*").remove();
        panelCounter = 0;
    }


})();