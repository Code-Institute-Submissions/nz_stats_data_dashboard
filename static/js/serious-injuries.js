queue()
    .defer(d3.csv, "data/injuries/sioi-2000-16-machine-readable-csv.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, seriousInjuryData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(seriousInjuryData);
    
    var parseDate = d3.time.format("%Y").parse;
    
    //cleanse data
      
      seriousInjuryData.forEach(function(d){
        //d.Data_value = parseInt(d.Data_value);
        d.Period = parseDate(d.Period);
            
      });
    
    show_serious_injury_cause_group_selector(ndx);
    show_serious_injury_units_group_selector(ndx);
    show_serious_injury_indicator_group_selector(ndx);
    show_serious_injury_population_group_selector(ndx);
    show_serious_injury_age_group_selector(ndx);
    show_serious_injury_severity_group_selector(ndx);
    show_serious_injury_type_line_chart(ndx);
    
    console.log(seriousInjuryData)
    
    dc.renderAll();
}

function show_serious_injury_cause_group_selector(ndx) {
    var groupDim = ndx.dimension(dc.pluck("Cause"));
    var groupSelect = groupDim.group();

    var select = dc.selectMenu("#serious-injury-cause-group-selector")
        .dimension(groupDim)
        .group(groupSelect);
        
        select.title(function (d){
               return d.key;
                 })
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

function show_serious_injury_population_group_selector(ndx) {
    var groupDim = ndx.dimension(dc.pluck("Population"));
    var groupSelect = groupDim.group();

    var select = dc.selectMenu("#serious-injury-population-group-selector")
        .dimension(groupDim)
        .group(groupSelect);
        
        select.title(function (d){
               return d.key;
                 })
}

function show_serious_injury_age_group_selector(ndx) {
    var groupDim = ndx.dimension(dc.pluck("Age"));
    var groupSelect = groupDim.group();

    var select = dc.selectMenu("#serious-injury-age-group-selector")
        .dimension(groupDim)
        .group(groupSelect);
        
        select.title(function (d){
               return d.key;
                 })
}

function show_serious_injury_severity_group_selector(ndx) {
    var groupDim = ndx.dimension(dc.pluck("Severity"));
    var groupSelect = groupDim.group();

    var select = dc.selectMenu("#serious-injury-severity-group-selector")
        .dimension(groupDim)
        .group(groupSelect);
        
        select.title(function (d){
               return d.key;
                 })
}

//**composite chart
function show_serious_injury_type_line_chart(ndx){
    var dateDim = ndx.dimension(dc.pluck("Period"));
    //var minDate = dateDim.bottom(1)[0].Period;
    //var maxDate = dateDim.top(1)[0].Period;
    var dataValueGroup = dateDim.group().reduceSum(function(d) {
        if (d.Type == "Single year") {
            return d.Data_value;
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


var filtered_group = remove_empty_bins(dataValueGroup);
    
        
    var lineChart = dc.lineChart("#serious-injury-type-line-chart");
        lineChart
            .width(1090)
            .height(400)
            .margins({top: 10, right: 10, bottom: 30, left: 55})
            .dimension(dateDim)
            .group(filtered_group)
            //.x(d3.time.scale().domain([minDate, maxDate]))
            .elasticX(true)
            .x(d3.time.scale())
            .yAxisLabel("Number of serious injuries")
            .elasticY(true)
            
            .brushOn(false);
    
}


//extra


