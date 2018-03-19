queue()
        .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-plt-by-country.csv")
        .defer(d3.json, "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
        .await(makeGraphs);
    function makeGraphs(error, countriesData, worldJson) {
        var ndx = crossfilter(countriesData);
        
         var parseDate = d3.time.format("%Y%m").parse;
    
        //cleanse data
        countriesData.forEach(function(d){
            d.Count = parseInt(d.Count);
            //d.Period = parseDate(d.Period);
                
          });
          
        show_passenger_type_direction_selector(ndx);
        show_passenger_type_period_selector(ndx);
        
        show_map_of_world(ndx, worldJson);
        show_row_chart(ndx);
        //show_bar_chart(ndx);
        dc.renderAll()
    };
    
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
    
    function show_map_of_world(ndx, worldJson) {
        var countryDim = ndx.dimension(dc.pluck('Country'));
        var group = countryDim.group().reduceSum(dc.pluck('Count'));
        var projection = d3.geo.mercator()
            .center([0,40])
            .scale(100)
            .rotate([-12,0]);
        dc.geoChoroplethChart("#world-map")
            .width(1200)
            .height(600)
            .dimension(countryDim)
            .group(group)
            .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#7C151D"])
            .colorDomain([500, 50000])
            .overlayGeoJson(worldJson["features"], "Country", function (d) {
                return d.properties.name;
            })
            .projection(projection)
            .title(function (p) {
                console.log(p);
                return "Country: " + p["key"]
                    + "\n"
                    + "Total Travellers: " + Math.round(p.value);
            });
    }
    function show_bar_chart(ndx) {
        var countryDim = ndx.dimension(dc.pluck('Country'));
        var group = countryDim.group().reduceSum(dc.pluck('Count'));
        dc.barChart("#country-bar-chart")
            .width(1200)
            .height(600)
            .margins({top: 10, right: 10, bottom: 50, left: 50})
            .dimension(countryDim)
            .group(group)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .elasticY(true)
            .xAxisLabel("Country")
            .yAxis().ticks(4);
    }
    
    function show_row_chart(ndx) {
        var countryDim = ndx.dimension(dc.pluck('Country'));
        var group = countryDim.group().reduceSum(dc.pluck('Count'));
        dc.rowChart("#country-row-chart")
            .width(1200)
            .height(2400)
            .margins({top: 10, right: 20, bottom: 50, left: 20})
            .dimension(countryDim)
            .group(group)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .elasticX(true)
            .xAxis().ticks(4);
    }