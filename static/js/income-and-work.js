queue()
    .defer(d3.csv, "data/income-and-work/qes-dec17qtr-csv.csv")
    .await(makeGraphs);
    
    function makeGraphs(error, labourData) {
        
    //Create a Crossfilter instance    
    var ndx = crossfilter(labourData);
    
    var parseDate = d3.time.format("%Y.%m").parse;
    
    //cleanse data
      
      labourData.forEach(function(d){
        //d.Data_value = parseInt(d.Data_value);
        d.Period = parseDate(d.Period);
            
      });
    
    show_labour_sector_group_selector(ndx);
    show_labour_pay_type_group_selector(ndx);
    show_labour_gender_composite_chart(ndx);
    
    console.log(labourData)
    
    dc.renderAll();
}

function show_labour_sector_group_selector(ndx) {
    var sectorDim = ndx.dimension(dc.pluck("Series_title_1"));
    var sectorSelect = sectorDim.group();

    var select = dc.selectMenu("#labour-sector-group-selector")
        .dimension(sectorDim)
        .group(sectorSelect);
        
        select.title(function (d){
               return d.key;
                })
}

function show_labour_pay_type_group_selector(ndx) {
    var payTypeDim = ndx.dimension(dc.pluck("Series_title_3"));
    var payTypeSelect = payTypeDim.group();

    var select = dc.selectMenu("#labour-pay-type-group-selector")
        .dimension(payTypeDim)
        .group(payTypeSelect);
        
        select.title(function (d){
                return d.key;
                 })
}

//**composite chart
function show_labour_gender_composite_chart(ndx){
    var dateDim = ndx.dimension(dc.pluck("Period"));
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


//extra


