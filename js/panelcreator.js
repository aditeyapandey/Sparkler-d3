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

    panel.createControlPanel = function(id, data)
    {
        const containerDiv = d3.select("#"+id).append("div").attr("class","container input-group mb-3");
        const dataForQuant = data.controllerData.quantitative
        const dataForCat = data.controllerData.categorical

        //X Field
        containerDiv.append("div").attr("class","input-group-prepend").append("span").attr("class","input-group-text").text("X")
        const selectX = containerDiv.append("select").attr("class","custom-select").property('value', 'tsne1')
        selectX.selectAll("option").data(dataForQuant).join("option").attr("value",d=>d).text(function (d) { return d; });

        //Y Field
        containerDiv.append("div").attr("class","input-group-prepend").append("span").attr("class","input-group-text").text("Y")
        const selectY = containerDiv.append("select").attr("class","custom-select").property('value', 'tsne2')
        selectY.selectAll("option").data(dataForQuant).join("option").attr("value",d=>d).text(function (d) { return d; });

        //Group Field
        containerDiv.append("div").attr("class","input-group-prepend").append("span").attr("class","input-group-text").text("Group")
        const selectG = containerDiv.append("select").attr("class","custom-select").property('value', 'stim')
        selectG.selectAll("option").data(dataForCat).join("option").attr("value",d=>d).text(function (d) { return d; });

    }


})();