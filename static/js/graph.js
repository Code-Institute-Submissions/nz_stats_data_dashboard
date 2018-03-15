queue()
    .defer(d3.csv, "/data/international-travel-and-migration/itm-jan18-totals.csv")
    .defer(d3.csv, "/data/international-travel-and-migration/itm-jan18-plt-key-series.csv")
    .await(makeTravelGraphs);
    
    function makeTravelGraphs(error, travelData, travelData2) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(travelData);
    var ndx2 = crossfilter(travelData2);
    
    
    var parseDate = d3.time.format("%Y%m").parse;
    
    //cleanse data
    travelData.forEach(function(d){
        d.Count = parseInt(d.Count);
        //d.Period = parseDate(d.Period);
            
      });
      
      travelData2.forEach(function(d){
        d.Count = parseInt(d.Count);
        d.Period = parseDate(d.Period);
            
      });
    
    show_passenger_type_direction_selector(ndx);
    show_passenger_type_period_selector(ndx);
    show_total_travel_row_chart(ndx);
    show_total_travel_pie_chart(ndx);
    
    show_citizenship_type_direction_selector(ndx2);
    show_citizenship_type_country_selector(ndx2);
    show_citizenship_type_composite_chart(ndx2);
    
    
    //show_arrivals_pie_chart(ndx);
    //show_departures_pie_chart(ndx);
    
    //show_arrivals_row_chart(ndx);
    //show_departures_row_chart(ndx);
    
    console.log(travelData)
    console.log(travelData2)
    
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

function show_citizenship_type_direction_selector(ndx2) {
    var directionDim = ndx2.dimension(dc.pluck("Direction"));
    var directionSelect = directionDim.group();

    dc.selectMenu("#citizenship-type-direction-selector")
        .dimension(directionDim)
        .group(directionSelect);
}

function show_citizenship_type_country_selector(ndx2) {
    var countryDim = ndx2.dimension(dc.pluck("Country"));
    var countrySelect = countryDim.group();

    dc.selectMenu("#citizenship-type-country-selector")
        .dimension(countryDim)
        .group(countrySelect);
}

//**piecharts**

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

function show_total_travel_pie_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    //directionDim.filterExact("Arrival");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var totalTravelPieChart = dc.pieChart("#total-travel-passenger-type-pie-chart");
    
    totalTravelPieChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .height(500)
        .radius(275)
        .innerRadius(75)
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

function show_arrivals_row_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    directionDim.filterExact("Arrival");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var arrivalsRowChart = dc.rowChart("#arrivals-passenger-type-chart");
    
    arrivalsRowChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(300)
        .height(250)
        .dimension(directionDim)
        .group(numPassengerType)
        .xAxis().ticks(4);
        
    }
    
function show_departures_row_chart(ndx) {
    var directionDim = ndx.dimension(dc.pluck("Direction"));
    directionDim.filterExact("Departure");
    var passengerTypeDim = ndx.dimension(dc.pluck("Passenger_type"));
    var numPassengerType = passengerTypeDim.group().reduceSum(dc.pluck("Count"));
    
    var departuresRowChart = dc.rowChart("#departures-passenger-type-chart");
    
    departuresRowChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(300)
        .height(250)
        .dimension(directionDim)
        .group(numPassengerType)
        .xAxis().ticks(4);
        
    }
    
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
    
//**composite chart
function show_citizenship_type_composite_chart(ndx2){
    var dateDim = ndx2.dimension(dc.pluck("Period"));
    var minDate = dateDim.bottom(1)[0].Period;
    var maxDate = dateDim.top(1)[0].Period;
    //&& d.Country === "All countries"
    
    var citizenshipNZ = dateDim.group().reduceSum(function (d) {
        console.log("d="+d);
            if (d.Citizenship === "NZ") {
                return +d.Count;
            } else {
                return 0;
            }
        });
        
    var citizenshipNonNZ = dateDim.group().reduceSum(function (d) {
            if (d.Citizenship === "non-NZ") {
                return +d.Count;
            } else {
                return 0;
            }
        });
    
        
    var compositeChart = dc.compositeChart('#citizenship-composite-chart');
        compositeChart
            .width(1090)
            .height(400)
            .dimension(dateDim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("No. of Travellers")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .elasticY(true)
            //.xAxis().ticks(d3.timeMonth)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(citizenshipNZ, 'NZ'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(citizenshipNonNZ, 'non-NZ')
            ])
            .brushOn(false);
    
}


//extra


