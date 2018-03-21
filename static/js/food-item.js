queue()
    .defer(d3.csv, "data/food-prices/food-price-index-feb18-weighted-average-prices-csv-tables.csv.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, foodData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(foodData);
    
    var parseDate = d3.time.format("%Y.%m").parse;
    
    //cleanse data
      
      foodData.forEach(function(d){
        d.Data_value = Math.round(d.Data_value);
        //console.log(d.Data_value);
        d.Period = parseDate(d.Period);
        console.log(d.Period);
            
      });
    
    show_food_item_group_selector(ndx);
    show_food_item_line_chart(ndx);
    
    console.log(foodData)
    
    dc.renderAll();
}

function show_food_item_group_selector(ndx) {
    var itemDim = ndx.dimension(dc.pluck("Series_title_1"));
    var itemSelect = itemDim.group();

    var select = dc.selectMenu("#food-item-group-selector")
        .dimension(itemDim)
        .group(itemSelect);
        
        select.title(function (d){
                 return d.key;
                   })
}

//**composite chart
function show_food_item_line_chart(ndx){
    var dateDim = ndx.dimension(dc.pluck("Period"));
    var minDate = dateDim.bottom(1)[0].Period;
    var maxDate = dateDim.top(1)[0].Period;
    var dataValueGroup = dateDim.group().reduceSum(dc.pluck("Data_value"));
    
    
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


//extra


