
function buildmetadata(sample){
    d3.json("data.json").then((data) => {
    
        var metadata = data.metadata;
        var result = metadata.filter(x => x.id == sample);
        var result1 = result[0]
    
    var output = d3.select("#sample-metadata");
    console.log(result)
    console.log(result1)

    Object.entries(result1).forEach(function([key, value]) {
        console.log(key,value);
        var row = output.append("tr");
        row.append("td").html(`<strong><font size = '1'>${key}</font></strong>:`);
        row.append('td').html(`<font size ='1'>${value}</font>`);
    });
    });
}

function init() {
    var selectId = d3.select("#selDataset");
    d3.json("data.json").then((data) => {
        var selectNames = data.names;
        selectNames.forEach((sample) => {
            selectId
              .append("option")
              .text(sample)
              .property("value", sample);
          });
    var sampleone = selectNames[0];
    buildmetadata(sampleone);
    buildSiteCharts(sampleone);
        });
}

init();
function optionChanged(new_ID){
    buildmetadata(new_ID);
    buildSiteCharts(new_ID);
}

//Build charts
function buildSiteCharts(sample) {
    console.log(sample);
    
    d3.json("data.json").then(function(data) {

        var samples = data.samples;
        
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var sampleData = resultArray[0];
        
        //Bar Chart
        var otuID = sampleData.otu_ids.slice(0,10).reverse();
        var sampleValues = sampleData.sample_values.slice(0,10).reverse();
        var hoverLabels = sampleData.otu_labels.slice(0,10).reverse();

        // y value
        otuMicrobes = []
        otuID.forEach(function(id) {
            var otuMicrobeName = `OTU ${id}`;
            otuMicrobes.push(otuMicrobeName);
        });

        //Bar chart trace 
        var samplesBarChart = [{
            type: "bar", 
            x: sampleValues,
            y: otuMicrobes,
            hovertext: hoverLabels,
            orientation: "h"
        }];

        //Layout of the bar chart 
        var barChartLayout = {
            title: "Microbe Bar Chart",
            height: 700,
            width: 500,
            xaxis: { autorange: true},
            hoverlabel: { bgcolor: "#459BD9"} 
        };

        //Display Bar Chart
        Plotly.newPlot("bar", samplesBarChart, barChartLayout);

        //x/y variables for the bubble chart
        var otuIDXAxis = sampleData.otu_ids;
        var sampleValuesYAxis = sampleData.sample_values;
        var otuTextValues = sampleData.otu_labels;

        //Bubble chart trace
        var bubbleChart = [{
            x: otuIDXAxis,
            y: sampleValuesYAxis,
            text: otuTextValues,
            mode: "markers", 
            marker: {
                colorscale: "Earth",
                size: sampleValuesYAxis,
                color: otuIDXAxis
            }
        }];

        // Bubble Chart Layout
        var bubbleChartLayout = {
            title: "Microbe Bubble Chart" ,
            xaxis: {title: "Sample OTU ID"},
            yaxis: {title: "Sample Values"},
            margin: {t:40}
        };

        //Display bubble chart
        Plotly.newPlot("bubble", bubbleChart, bubbleChartLayout);  
        
    });

};