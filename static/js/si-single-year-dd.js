queue()
    .defer(d3.csv, "data/injuries/sioi-2000-16-machine-readable-csv.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, seriousInjuryData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(seriousInjuryData);
    
    
    var parseDate = d3.time.format("%Y").parse;
    
    //cleanse data
    seriousInjuryData.forEach(function(d){
        d.Data_value = parseInt(d.Data_value);
        //d.Period = parseDate(d.Period);
            
      });
    
    show_serious_injury_units_group_selector(ndx);
    show_serious_injury_indicator_group_selector(ndx);
    show_serious_injury_dd_bar_chart(ndx);
    show_population_pie_chart(ndx);
    show_age_pie_chart(ndx);
    show_cause_row_chart(ndx);
    show_severity_row_chart(ndx);
    
    console.log(seriousInjuryData)
    
    dc.renderAll();
}

function show_serious_injury_units_group_selector(ndx) {
    var groupDim = ndx.dimension(dc.pluck("Units"));
    var groupSelect = groupDim.group();

    var select = dc.selectMenu("#serious-injury-units-group-selector")
        .dimension(groupDim)
        .group(groupSelect);
        
        select.title(function (d){
               return d.key;
                 })
}

function show_serious_injury_indicator_group_selector(ndx) {
    var groupDim = ndx.dimension(dc.pluck("Indicator"));
    var groupSelect = groupDim.group();

    var select = dc.selectMenu("#serious-injury-indicator-group-selector")
        .dimension(groupDim)
        .group(groupSelect);
        
        select.title(function (d){
               return d.key;
                 })
}


//**charts**
    
    function show_serious_injury_dd_bar_chart(ndx) {
    var dateDim = ndx.dimension(dc.pluck("Period"));
    var dataValueGroup = dateDim.group().reduceSum(function(d) {
        if (d.Type == "Single year") {
            return d.Data_value;
        } else {
            return 0;
        }
    });
    
    var seriousInjuryDDBarChart = dc.barChart("#serious-injury-dd-bar-chart");
    
    var yearsMovingAverage = ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016"]
    
    seriousInjuryDDBarChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(750)
        .height(300)
        .margins({top: 10, right: 10, bottom: 30, left: 55})
        .dimension(dateDim)
        .group(dataValueGroup)
        .x(d3.scale.ordinal().domain(yearsMovingAverage))
        .xUnits(dc.units.ordinal)  // required for graph to display correctly with ordinal scale
        .yAxisLabel("Average No. of Serious Injuries")
        .elasticY(true)
        .brushOn(false);
        
        
        
    }

    function show_population_pie_chart(ndx) {
        var populationTypeDim = ndx.dimension(dc.pluck("Population"));
        var numPopulationType = populationTypeDim.group().reduceSum(dc.pluck("Data_value"));
        
        var populationTypePieChart = dc.pieChart("#population-pie-chart");
        
        populationTypePieChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .height(300)
            .radius(200)
            .innerRadius(50)
            .transitionDuration(1500)
            .dimension(populationTypeDim)
            .group(numPopulationType)
            .legend(dc.legend());
          // example of formatting the legend via svg
          // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
          populationTypePieChart.on('pretransition', function(populationTypePieChart) {
            populationTypePieChart.selectAll('.dc-legend-item text')
                  .text('')
                .append('tspan')
                  .text(function(d) { return d.name; })
                .append('tspan')
                  .attr('x', 135)
                  .attr('text-anchor', 'end')
                  .text(function(d) { return d.data; });
          });
          
    }

    function show_age_pie_chart(ndx) {
        var ageDim = ndx.dimension(dc.pluck("Age"));
        var ageType = ageDim.group().reduceSum(dc.pluck("Data_value"));
        
        var agePieChart = dc.pieChart("#age-pie-chart");
        
        agePieChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .height(300)
            .radius(200)
            .innerRadius(50)
            .transitionDuration(1500)
            .dimension(ageDim)
            .group(ageType)
            .legend(dc.legend());
          // example of formatting the legend via svg
          // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
          agePieChart.on('pretransition', function(agePieChart) {
            agePieChart.selectAll('.dc-legend-item text')
                  .text('')
                .append('tspan')
                  .text(function(d) { return d.name; })
                .append('tspan')
                  .attr('x', 110)
                  .attr('text-anchor', 'end')
                  .text(function(d) { return d.data; });
          });
          
    }
    
    function show_cause_row_chart(ndx) {
        var causeDim = ndx.dimension(dc.pluck("Cause"));
        var causeCount = causeDim.group().reduceSum(dc.pluck("Data_value"));
        
        var causeRowChart = dc.rowChart("#cause-row-chart");
        
        causeRowChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .width(450)
            .height(300)
            .dimension(causeDim)
            .group(causeCount)
            .rowsCap(20)
            .elasticX(true)
            .renderLabel(false)
            .renderTitleLabel(true)
            .titleLabelOffsetX(80)
            .xAxis().ticks(8);
            
        }

    function show_severity_row_chart(ndx) {
        var severityDim = ndx.dimension(dc.pluck("Severity"));
        var severityCount = severityDim.group().reduceSum(dc.pluck("Data_value"));
        
        var severityRowChart = dc.rowChart("#severity-row-chart");
        
        severityRowChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .width(300)
            .height(300)
            .dimension(severityDim)
            .group(severityCount)
            .rowsCap(20)
            .elasticX(true)
            .renderLabel(false)
            .renderTitleLabel(true)
            .titleLabelOffsetX(80)
            .xAxis().ticks(4);
            
        }
    
    
    
    


