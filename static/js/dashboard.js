queue()
    .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-vis-res-by-country.csv")
    .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-plt-key-series.csv")
    .defer(d3.csv, "data/international-travel-and-migration/itm-jan18-plt-by-country.csv")
    .defer(d3.json, "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    .defer(d3.csv, "data/food-prices/food-price-index-feb18-weighted-average-prices-csv-tables.csv.csv")
    .defer(d3.csv, "data/injuries/sioi-2000-16-machine-readable-csv.csv")
    .defer(d3.csv, "data/income-and-work/qes-dec17qtr-csv.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, travelDashboardData, travelCompositeData, travelMapData, worldJson, foodItemData, seriousInjuriesData, labourData) {
        
    //Create a Crossfilter instance    
    var ndx_travelDashboard = crossfilter(travelDashboardData);
    var ndx_travelComposite = crossfilter(travelCompositeData);
    var ndx_travelMap = crossfilter(travelMapData);
    var ndx_foodItem = crossfilter(foodItemData);
    var ndx_seriousInjuries = crossfilter(seriousInjuriesData);
    var ndx_labour = crossfilter(labourData);
    
    
    //cleanse data
    travelDashboardData.forEach(function(d){
        d.Count = parseInt(d.Count);
        //d.Period = parseDate(d.Period);
            
      });

    var parseDate_travelCompositeData = d3.time.format("%Y%m").parse;

    travelCompositeData.forEach(function(d){
        d.Count = parseInt(d.Count);
        d.Period = parseDate_travelCompositeData(d.Period);
        
    });

    //var parseDate_travelMapData = d3.time.format("%Y%m").parse;

    //cleanse data
    travelMapData.forEach(function(d){
        d.Count = parseInt(d.Count);
        //d.Period = parseDate(d.Period);
            
        });


    var parseDate_foodItemData = d3.time.format("%Y.%m").parse;
        
    foodItemData.forEach(function(d){
        //d.Data_value = Math.round(d.Data_value);
        //console.log(d.Data_value);
        d.Period = parseDate_foodItemData(d.Period);
        //console.log(d.Period);
        
    });

      //var parseDate_seriousInjuryData = d3.time.format("%Y").parse;
    
    //cleanse data
    seriousInjuriesData.forEach(function(d){
        d.Data_value = parseInt(d.Data_value);
        //d.Period = parseDate_seriousInjuryData(d.Period);
            
      });

      var parseDate_labourData = d3.time.format("%Y.%m").parse;
    
    //cleanse data
      
      labourData.forEach(function(d){
        //d.Data_value = parseInt(d.Data_value);
        d.Period = parseDate_labourData(d.Period);
            
      });
    
    show_travel_dd_bar_chart(ndx_travelDashboard);
    show_passenger_type_pie_chart(ndx_travelDashboard);
    show_direction_pie_chart(ndx_travelDashboard);
    show_country_row_chart(ndx_travelDashboard);

    show_citizenship_type_direction_selector(ndx_travelComposite);
    show_citizenship_type_country_selector(ndx_travelComposite);
    show_citizenship_type_composite_chart(ndx_travelComposite);

    show_passenger_type_direction_selector(ndx_travelMap);
    show_passenger_type_period_selector(ndx_travelMap);
    show_map_of_world(ndx_travelMap, worldJson);
    show_row_chart(ndx_travelMap);

    show_food_item_group_selector(ndx_foodItem);
    show_food_item_line_chart(ndx_foodItem);

    show_serious_injury_units_group_selector(ndx_seriousInjuries);
    show_serious_injury_indicator_group_selector(ndx_seriousInjuries);
    show_serious_injury_dd_bar_chart(ndx_seriousInjuries);
    show_population_pie_chart(ndx_seriousInjuries);
    show_age_pie_chart(ndx_seriousInjuries);
    show_cause_row_chart(ndx_seriousInjuries);
    show_severity_row_chart(ndx_seriousInjuries);

    show_labour_sector_group_selector(ndx_labour);
    show_labour_pay_type_group_selector(ndx_labour);
    show_labour_gender_composite_chart(ndx_labour);
    
    
    console.log(travelDashboardData);
    console.log(travelCompositeData);
    console.log(travelMapData);
    console.log(foodItemData);
    console.log(seriousInjuriesData);
    console.log(labourData);
    
    dc.renderAll();
    d3.select("#loader").classed("hidden", true);
}


//**travelDashboardData charts**
    
    function show_travel_dd_bar_chart(ndx_travelDashboard) {
    var dateDim = ndx_travelDashboard.dimension(dc.pluck("Period"));
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

    function show_passenger_type_pie_chart(ndx_travelDashboard) {
        var passengerTypeDim = ndx_travelDashboard.dimension(dc.pluck("Passenger_type"));
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

    function show_direction_pie_chart(ndx_travelDashboard) {
        var directionDim = ndx_travelDashboard.dimension(dc.pluck("Direction"));
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
    
    function show_country_row_chart(ndx_travelDashboard) {
        var countryDim = ndx_travelDashboard.dimension(dc.pluck("Country"));
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


    //**travelCompositeData charts**
        function show_citizenship_type_direction_selector(ndx_travelComposite) {
            var directionDim = ndx_travelComposite.dimension(dc.pluck("Direction"));
            var directionSelect = directionDim.group();
        
            var select = dc.selectMenu("#citizenship-type-direction-selector")
                .dimension(directionDim)
                .group(directionSelect);
                
                select.title(function (d){
                       return d.key;
                        })
        }
        
        function show_citizenship_type_country_selector(ndx_travelComposite) {
            var countryDim = ndx_travelComposite.dimension(dc.pluck("Country"));
            var countrySelect = countryDim.group();
        
            var select = dc.selectMenu("#citizenship-type-country-selector")
                .dimension(countryDim)
                .group(countrySelect);
                
                select.title(function (d){
                        return d.key;
                         })
        }
        
        
        function show_citizenship_type_composite_chart(ndx_travelComposite){
            var dateDim = ndx_travelComposite.dimension(dc.pluck("Period"));
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
                    .margins({top: 10, right: 10, bottom: 30, left: 45})
                    .dimension(dateDim)
                    .x(d3.time.scale().domain([minDate, maxDate]))
                    .yAxisLabel("No. of Travellers")
                    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
                    .renderHorizontalGridLines(true)
                    .elasticY(true)
                    //.xAxis().ticks(d3.timeMonth)
                    .compose([
                        dc.lineChart(compositeChart)
                            .colors('black')
                            .group(citizenshipNZ, 'NZ'),
                        dc.lineChart(compositeChart)
                            .colors('blueviolet')
                            .group(citizenshipNonNZ, 'non-NZ')
                    ])
                    .brushOn(false);
            
        }

        //**travelMapData charts**
        function show_passenger_type_direction_selector(ndx_travelMap) {
            var directionDim = ndx_travelMap.dimension(dc.pluck("Direction"));
            var directionSelect = directionDim.group();
        
            var select = dc.selectMenu("#passenger-type-direction-selector")
                .dimension(directionDim)
                .group(directionSelect);
                
                select.title(function (d){
                        return d.key;
                         })
            }
        
            function show_passenger_type_period_selector(ndx_travelMap) {
                var periodDim = ndx_travelMap.dimension(dc.pluck("Period"));
                var periodSelect = periodDim.group();
            
                var select = dc.selectMenu("#passenger-type-period-selector")
                    .dimension(periodDim)
                    .group(periodSelect);
                    
                    select.title(function (d){
                        return d.key;
                         })
            }
            
            function show_map_of_world(ndx_travelMap, worldJson) {
                var countryDim = ndx_travelMap.dimension(dc.pluck('Country'));
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
            function show_bar_chart(ndx_travelMap) {
                var countryDim = ndx_travelMap.dimension(dc.pluck('Country'));
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
            
            function show_row_chart(ndx_travelMap) {
                var countryDim = ndx_travelMap.dimension(dc.pluck('Country'));
                var group = countryDim.group().reduceSum(dc.pluck('Count'));
                
                function remove_empty_bins(source_group) {
            return {
                all:function () {
                    return source_group.all().filter(function(d) {
                        console.log("d.value:"+d.value)
                        return d.value != 0;
                    });
                }
            };
        }
        
        
        var filtered_group = remove_empty_bins(group);
                
                dc.rowChart("#world-map-country-row-chart")
                    .width(1200)
                    .height(2400)
                    .margins({top: 10, right: 20, bottom: 50, left: 20})
                    .dimension(countryDim)
                    .group(filtered_group)
                    .transitionDuration(500)
                    .x(d3.scale.ordinal())
                    .elasticX(true)
                    .xAxis().ticks(4);
            }

        
        //**foodItemData charts**
            function show_food_item_group_selector(ndx_foodItem) {
                var itemDim = ndx_foodItem.dimension(dc.pluck("Series_title_1"));
                var itemSelect = itemDim.group();
            
                var select = dc.selectMenu("#food-item-group-selector")
                    .dimension(itemDim)
                    .group(itemSelect);
                    
                    select.title(function (d){
                             return d.key;
                               })
            }
            
            
            function show_food_item_line_chart(ndx_foodItem){
                var dateDim = ndx_foodItem.dimension(dc.pluck("Period"));
                var minDate = dateDim.bottom(1)[0].Period;
                var maxDate = dateDim.top(1)[0].Period;
                var dataValueGroup = dateDim.group().reduceSum(dc.pluck("Data_value"));
                
                
                function remove_empty_bins(source_group) {
                return {
                    all:function () {
                        return source_group.all().filter(function(d) {
                            console.log("d.value:"+d.value)
                            return d.value >= .001;
                        });
                    }
                };
            }
            
            
            var filtered_group = remove_empty_bins(dataValueGroup);
                
                    
                var lineChart = dc.lineChart("#food-item-line-chart");
                    lineChart
                        .width(1090)
                        .height(400)
                        .dimension(dateDim)
                        .group(filtered_group)
                        //.x(d3.time.scale().domain([minDate, maxDate]))
                        .elasticX(true)
                        .x(d3.time.scale())
                        .yAxisLabel("Food Price Index Value")
                        .elasticY(true)
                        
                        .brushOn(false);
                
            }

        //**seriousInjuriesData charts**
        function show_serious_injury_units_group_selector(ndx_seriousInjuries) {
            var groupDim = ndx_seriousInjuries.dimension(dc.pluck("Units"));
            var groupSelect = groupDim.group();
        
            var select = dc.selectMenu("#serious-injury-units-group-selector")
                .dimension(groupDim)
                .group(groupSelect);
                
                select.title(function (d){
                       return d.key;
                         })
        }
        
        function show_serious_injury_indicator_group_selector(ndx_seriousInjuries) {
            var groupDim = ndx_seriousInjuries.dimension(dc.pluck("Indicator"));
            var groupSelect = groupDim.group();
        
            var select = dc.selectMenu("#serious-injury-indicator-group-selector")
                .dimension(groupDim)
                .group(groupSelect);
                
                select.title(function (d){
                       return d.key;
                         })
        }
        
            
            function show_serious_injury_dd_bar_chart(ndx_seriousInjuries) {
            var dateDim = ndx_seriousInjuries.dimension(dc.pluck("Period"));
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
        
            function show_population_pie_chart(ndx_seriousInjuries) {
                var populationTypeDim = ndx_seriousInjuries.dimension(dc.pluck("Population"));
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
        
            function show_age_pie_chart(ndx_seriousInjuries) {
                var ageDim = ndx_seriousInjuries.dimension(dc.pluck("Age"));
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
            
            function show_cause_row_chart(ndx_seriousInjuries) {
                var causeDim = ndx_seriousInjuries.dimension(dc.pluck("Cause"));
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
        
            function show_severity_row_chart(ndx_seriousInjuries) {
                var severityDim = ndx_seriousInjuries.dimension(dc.pluck("Severity"));
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

        //**labourData charts**
        function show_labour_sector_group_selector(ndx_labour) {
            var sectorDim = ndx_labour.dimension(dc.pluck("Series_title_1"));
            var sectorSelect = sectorDim.group();
        
            var select = dc.selectMenu("#labour-sector-group-selector")
                .dimension(sectorDim)
                .group(sectorSelect);
                
                select.title(function (d){
                       return d.key;
                        })
        }
        
        function show_labour_pay_type_group_selector(ndx_labour) {
            var payTypeDim = ndx_labour.dimension(dc.pluck("Series_title_3"));
            var payTypeSelect = payTypeDim.group();
        
            var select = dc.selectMenu("#labour-pay-type-group-selector")
                .dimension(payTypeDim)
                .group(payTypeSelect);
                
                select.title(function (d){
                        return d.key;
                         })
        }
        
    
        function show_labour_gender_composite_chart(ndx_labour){
            var dateDim = ndx_labour.dimension(dc.pluck("Period"));
            //var minDate = dateDim.bottom(1)[0].Period;
            //var maxDate = dateDim.top(1)[0].Period;
            
            var genderMale = dateDim.group().reduceSum(function (d) {
                console.log("d="+d);
                    if (d.Series_title_2 === "Male") {
                        return +d.Data_value;
                    } else {
                        return 0;
                    }
                });
                
            var genderFemale = dateDim.group().reduceSum(function (d) {
                    if (d.Series_title_2 === "Female") {
                        return +d.Data_value;
                    } else {
                        return 0;
                    }
                });
                
                function remove_empty_bins(source_group) {
            return {
                all:function () {
                    return source_group.all().filter(function(d) {
                        return d.value >= .001;
                    });
                }
            };
        }
        
        
        var filtered_group_male = remove_empty_bins(genderMale);
        var filtered_group_female = remove_empty_bins(genderFemale);
            
                
            var compositeChart = dc.compositeChart('#labour-gender-composite-chart');
                compositeChart
                    .width(1090)
                    .height(400)
                    .dimension(dateDim)
                    //.x(d3.time.scale().domain([minDate, maxDate]))
                    .elasticX(true)
                    .x(d3.time.scale())
                    //.yAxisLabel("Earnings in Dollars")
                    .margins({top: 10, right: 10, bottom: 30, left: 70})
                    .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
                    .renderHorizontalGridLines(true)
                    .elasticY(true)
                    //.xAxis().ticks(d3.timeMonth)
                    .compose([
                        dc.lineChart(compositeChart)
                            .colors('indigo')
                            .group(filtered_group_male, 'Male'),
                        dc.lineChart(compositeChart)
                            .colors('salmon')
                            .group(filtered_group_female, 'Female')
                    ])
                    .brushOn(false);
                    
            
        }
        
        
        
    
    
    


