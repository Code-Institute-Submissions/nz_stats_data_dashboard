queue()
    .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-totals.csv")
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
    
    show_passenger_type_direction_selector(ndx);
    show_passenger_type_period_selector(ndx);
    show_total_travel_row_chart(ndx);
    show_total_travel_pie_chart(ndx);
    
    console.log(travelData)
    
    dc.renderAll();
}

function show_passenger_type_direction_selector(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    var directionSelect = directionDim.group();

    dc.selectMenu("#passenger-type-direction-selector")
        .dimension(directionDim)
        .group(directionSelect);
}

function show_passenger_type_period_selector(ndx) {
    var periodDim = ndx.dimension(dc.pluck("Period"));
    var periodSelect = periodDim.group();

    dc.selectMenu("#passenger-type-period-selector")
        .dimension(periodDim)
        .group(periodSelect);
}

//**piecharts**

function show_total_travel_pie_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    //directionDim.filterExact("Arrival");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var totalTravelPieChart = dc.pieChart("#total-travel-passenger-type-pie-chart");
    
    totalTravelPieChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .height(500)
        .radius(400)
        .innerRadius(50)
        .transitionDuration(1500)
        .dimension(directionDim)
        .group(numPassengerType)
        .legend(dc.legend());
      // example of formatting the legend via svg
      // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      totalTravelPieChart.on('pretransition', function(totalTravelPieChart) {
          totalTravelPieChart.selectAll('.dc-legend-item text')
              .text('')
            .append('tspan')
              .text(function(d) { return d.name; })
            .append('tspan')
              .attr('x', 150)
              .attr('text-anchor', 'end')
              .text(function(d) { return d.data; });
      });
      
}


//**row charts**
    
    function show_total_travel_row_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    //directionDim.filterExact("Departure");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var totalTravelRowChart = dc.rowChart("#total-travel-passenger-type-row-chart");
    
    totalTravelRowChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(900)
        .height(450)
        .dimension(directionDim)
        .group(numPassengerType)
        .elasticX(true)
        .renderLabel(false)
        .renderTitleLabel(true)
        .titleLabelOffsetX(80)
        .xAxis().ticks(16);
        
    }


