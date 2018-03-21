queue()
    .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-plt-key-series.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, travelData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(travelData);
    
    var parseDate = d3.time.format("%Y%m").parse;
    
    //cleanse data
      
      travelData.forEach(function(d){
        d.Count = parseInt(d.Count);
        d.Period = parseDate(d.Period);
            
      });
    
    show_citizenship_type_direction_selector(ndx);
    show_citizenship_type_country_selector(ndx);
    show_citizenship_type_composite_chart(ndx);
    
    console.log(travelData)
    
    dc.renderAll();
}

function show_citizenship_type_direction_selector(ndx2) {
    var directionDim = ndx2.dimension(dc.pluck("Direction"));
    var directionSelect = directionDim.group();

    var select = dc.selectMenu("#citizenship-type-direction-selector")
        .dimension(directionDim)
        .group(directionSelect);
        
        select.title(function (d){
               return d.key;
                })
}

function show_citizenship_type_country_selector(ndx2) {
    var countryDim = ndx2.dimension(dc.pluck("Country"));
    var countrySelect = countryDim.group();

    var select = dc.selectMenu("#citizenship-type-country-selector")
        .dimension(countryDim)
        .group(countrySelect);
        
        select.title(function (d){
                return d.key;
                 })
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


