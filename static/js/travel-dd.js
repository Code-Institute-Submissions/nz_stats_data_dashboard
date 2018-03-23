queue()
    .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-vis-res-by-country.csv")
    .await(makeTravelGraphs);
    
    function makeTravelGraphs(error, travelData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(travelData);
    
    
    var parseDate = d3.time.format("%Y%m").parse;
    
    //cleanse data
    travelData.forEach(function(d){
        d.Count = parseInt(d.Count);
        //d.Period = parseDate(d.Period);
            
      });
    
    show_travel_dd_bar_chart(ndx);
    show_passenger_type_pie_chart(ndx);
    show_direction_pie_chart(ndx);
    show_country_row_chart(ndx);
    
    console.log(travelData)
    
    dc.renderAll();
}


//**row charts**
    
    function show_travel_dd_bar_chart(ndx) {
    var dateDim = ndx.dimension(dc.pluck("Period"));
    var minDate = dateDim.bottom(1)[0].Period;
    var maxDate = dateDim.top(1)[0].Period;
    var numTravellers = dateDim.group().reduceSum(dc.pluck("Count"));
    
    var travelDDBarChart = dc.barChart("#travel-dd-bar-chart");

    var yearMonths = [201502,201503,201504,201505,201506,201507,201508,201509,201510,201511,201512,201601,201602,201603,201604,201605,201606,201607,201608,201609,201610,201611,201612,201701,201702,201703,201704,201705,201706,201707,201708,201709,201710,201711,201712,201801]
    
    travelDDBarChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(750)
        .height(300)
        .margins({top: 10, right: 10, bottom: 30, left: 55})
        .dimension(dateDim)
        .group(numTravellers)
        //.x(d3.time.scale().domain([minDate, maxDate]))
        //.xUnits(d3.time.months)
        .x(d3.scale.ordinal().domain(yearMonths))
        .xUnits(dc.units.ordinal)  // required for graph to display correctly with ordinal scale
        .yAxisLabel("No. of Travellers")
        .elasticY(true)
        .brushOn(false);
        //.xAxis().ticks(4);

        var ticks = yearMonths.filter(function(v, i) { return i % 2 === 0; });
        travelDDBarChart.xAxis().tickValues(ticks);
        
        
    }

    function show_passenger_type_pie_chart(ndx) {
        var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
        var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
        
        var passengerTypePieChart = dc.pieChart("#passenger-type-pie-chart");
        
        passengerTypePieChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .height(300)
            .radius(200)
            .innerRadius(50)
            .transitionDuration(1500)
            .dimension(passengerTypeDim)
            .group(numPassengerType)
            .legend(dc.legend());
          // example of formatting the legend via svg
          // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
          passengerTypePieChart.on('pretransition', function(passengerTypePieChart) {
            passengerTypePieChart.selectAll('.dc-legend-item text')
                  .text('')
                .append('tspan')
                  .text(function(d) { return d.name; })
                .append('tspan')
                  .attr('x', 135)
                  .attr('text-anchor', 'end')
                  .text(function(d) { return d.data; });
          });
          
    }

    function show_direction_pie_chart(ndx) {
        var directionDim = ndx.dimension(dc.pluck("Direction"));
        var directionType = directionDim.group().reduceSum(dc.pluck("Count"));
        
        var directionPieChart = dc.pieChart("#direction-pie-chart");
        
        directionPieChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .height(300)
            .radius(200)
            .innerRadius(50)
            .transitionDuration(1500)
            .dimension(directionDim)
            .group(directionType)
            .legend(dc.legend());
          // example of formatting the legend via svg
          // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
          directionPieChart.on('pretransition', function(directionPieChart) {
            directionPieChart.selectAll('.dc-legend-item text')
                  .text('')
                .append('tspan')
                  .text(function(d) { return d.name; })
                .append('tspan')
                  .attr('x', 110)
                  .attr('text-anchor', 'end')
                  .text(function(d) { return d.data; });
          });
          
    }
    
    function show_country_row_chart(ndx) {
        var countryDim = ndx.dimension(dc.pluck("Country"));
        var countryCount = countryDim.group().reduceSum(dc.pluck("Count"));
        
        var totalTravelRowChart = dc.rowChart("#country-row-chart");
        
        totalTravelRowChart
            .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
            .width(450)
            .height(600)
            .dimension(countryDim)
            .group(countryCount)
            .rowsCap(20)
            .elasticX(true)
            .renderLabel(false)
            .renderTitleLabel(true)
            .titleLabelOffsetX(80)
            .xAxis().ticks(8);
            
        }
    
    
    
    


