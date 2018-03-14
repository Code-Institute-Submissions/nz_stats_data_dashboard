queue()
    .defer(d3.csv, "/data/international-travel-and-migration/itm-jan18-totals.csv")
    .await(makeTravelGraphs);
    
    function makeTravelGraphs(error, travelData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(travelData);
    
    var parseDate = d3.time.format("%Y%m").parse;
    
    //cleanse data
    travelData.forEach(function(d){
        d.Count = parseInt(d.Count);
        d.Period = parseDate(d.Period);
            
      });
    
    
    show_arrivals_pie_chart(ndx);
    show_departures_pie_chart(ndx);
    console.log(travelData)
    
    dc.renderAll();
}

function show_arrivals_pie_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    directionDim.filterExact("Arrival");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var arrivalsPieChart = dc.pieChart("#arrivals-passenger-type-chart");
    
    arrivalsPieChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .height(440)
        .radius(180)
        .innerRadius(80)
        .transitionDuration(1500)
        .dimension(directionDim)
        .group(numPassengerType)
        .legend(dc.legend());
      // example of formatting the legend via svg
      // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      arrivalsPieChart.on('pretransition', function(arrivalsPieChart) {
          arrivalsPieChart.selectAll('.dc-legend-item text')
              .text('')
            .append('tspan')
              .text(function(d) { return d.name; })
            .append('tspan')
              .attr('x', 100)
              .attr('text-anchor', 'end')
              .text(function(d) { return d.data; });
      });
}

function show_departures_pie_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    directionDim.filterExact("Departure");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var departuresPieChart = dc.pieChart("#departures-passenger-type-chart");
    
    departuresPieChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .height(440)
        .radius(180)
        .innerRadius(80)
        .transitionDuration(1500)
        .dimension(directionDim)
        .group(numPassengerType)
        .legend(dc.legend());
      // example of formatting the legend via svg
      // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      departuresPieChart.on('pretransition', function(departuresPieChart) {
          departuresPieChart.selectAll('.dc-legend-item text')
              .text('')
            .append('tspan')
              .text(function(d) { return d.name; })
            .append('tspan')
              .attr('x', 100)
              .attr('text-anchor', 'end')
              .text(function(d) { return d.data; });
      });
}
