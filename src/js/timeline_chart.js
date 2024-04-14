// Initializing Global Variables
// Data Variable
var total_leetcode_data;

// SVG element and margins
var timeline_svg;

document.addEventListener("DOMContentLoaded", function() {
    // Select the svg element
    timeline_svg = d3.select("#timeline_svg")
    
    console.log(timeline_svg.node());

    const progress_g = timeline_svg.append("g")

    // Dimension data of progress svg
    const width = parseInt(timeline_svg.style("width").replace("px", ""));
    const height = parseInt(timeline_svg.style("height").replace("px", ""));
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    timeline_svg.attr("width", innerWidth)
        .attr("height", innerHeight)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // AXES
    // X axis
    const progress_xScale = d3.scaleTime()
        .range([+margin.left, innerWidth])

    // Y axis
    const progress_yScale = d3.scaleLinear()
        .range([+margin.top, margin.top+75])

    // Append Axes to svg
    // Append x Axis
    progress_g.append("g")
        .call(d3.axisBottom(progress_xScale))
        .attr("class", "progressXScale")
        .attr('transform',`translate(0, ${margin.top+75})`);

    // Append y Axis
    progress_g.append("g")
        .call(d3.axisLeft(progress_yScale))
        .attr("class", "progressYScale")
        .attr('transform', `translate(${margin.left}, 0)`);

    Promise.all([d3.csv("../data/progress.csv")]).then(value => {
        progress_data = value[0];

        // Data wrangling for progress data
        progress_data.forEach(d =>{
            d.leetcode = +d["Leetcode"];
            d.date = parseTime(d["Date"]);
        });

        var columnsToDelete = ["Date", "Leetcode"];

        total_leetcode_data = progress_data.map(function(d) {
            columnsToDelete.forEach(function(column) {
                delete d[column];
            });
            return d;
        });

        var i = 0;

        /*while(i<total_leetcode_data.length){
            if(i>=total_leetcode_data.length){
                break;
            }
            if(i==0){
                if(total_leetcode_data[i]["leetcode"]!=0){
                    var currdate = total_leetcode_data[i]["date"];
                    var nextdate = total_leetcode_data[i+1]["date"];

                    if(JSON.stringify(d3.timeDay.offset(currdate, 1))!=JSON.stringify(nextdate)){
                        total_leetcode_data.splice(i+1, 0, {"leetcode":0, "date": d3.timeDay.offset(currdate, 1)});
                    }
                }
            }
            else if(i==total_leetcode_data.length-1){
                if(total_leetcode_data[i]["leetcode"]!=0){
                    var currdate = total_leetcode_data[i]["date"];
                    var prevdate = total_leetcode_data[i-1]["date"];

                    if(JSON.stringify(d3.timeDay.offset(currdate, -1))!=JSON.stringify(prevdate)){
                        total_leetcode_data.splice(i, 0, {"leetcode":0, "date": d3.timeDay.offset(currdate, -1)});
                    }
                }
                break;
            }
            else{
                if(total_leetcode_data[i]["leetcode"]!=0){
                    var currdate = total_leetcode_data[i]["date"];
                    var prevdate = total_leetcode_data[i-1]["date"];
                    var nextdate = total_leetcode_data[i+1]["date"];

                    if(JSON.stringify(d3.timeDay.offset(currdate, -1))!=JSON.stringify(prevdate)){
                        total_leetcode_data.splice(i, 0, {"leetcode":0, "date": d3.timeDay.offset(currdate, -1)});
                        i++;
                    }
                    if(JSON.stringify(d3.timeDay.offset(currdate, 1))!=JSON.stringify(nextdate)){
                        total_leetcode_data.splice(i+1, 0, {"leetcode":0, "date": d3.timeDay.offset(currdate, 1)});
                    }
                }
            }
            i+=1
        }*/

        console.log(total_leetcode_data);

        // Animate Scales
        // Set domain of axes
        progress_xScale.domain([parseTime("2022-07-01"), d3.max(progress_data, function(d) {  return d.date; })])
        progress_yScale.domain([d3.max(progress_data, function(d) {  return d.leetcode; }), 0])
        
        // Transition of axes
        timeline_svg.selectAll(".progressXScale").transition()
            .duration(1000)
            .call((d3.axisBottom(progress_xScale)));

        timeline_svg.selectAll(".progressYScale").transition()
                .duration(1000)
                .call((d3.axisLeft(progress_yScale)));

        // Fall 2022 start line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2022-08-17")) )
            .attr("x2", progress_xScale(parseTime("2022-08-17")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Fall 2022 end line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2022-12-09")) )
            .attr("x2", progress_xScale(parseTime("2022-12-09")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Spring 2023 start line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2023-01-09")) )
            .attr("x2", progress_xScale(parseTime("2023-01-09")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Spring 2023 end line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2023-05-06")) )
            .attr("x2", progress_xScale(parseTime("2023-05-06")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Fall 2023 start line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2023-08-17")) )
            .attr("x2", progress_xScale(parseTime("2023-08-17")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Fall 2023 end line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2023-12-09")) )
            .attr("x2", progress_xScale(parseTime("2023-12-09")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Spring 2024 start line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2024-01-08")) )
            .attr("x2", progress_xScale(parseTime("2024-01-08")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        // Spring 2024 end line
        timeline_svg.append("line")
            .attr("x1", progress_xScale(parseTime("2024-05-04")) )
            .attr("x2", progress_xScale(parseTime("2024-05-04")) )
            .attr("y1", margin.top)
            .attr("y2", innerHeight-margin.bottom)
            .style("stroke", "grey")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5");

        timeline_svg.append("g")
        .selectAll("tdot")
        .data(total_leetcode_data)
        .enter()
        .append("circle")
            .attr("transform", "translate(0, 0)")
            .attr("cx", function (d) { return progress_xScale(d3.select(d).property("date")); } )
            .attr("cy", function(d) { return progress_yScale(d3.select(d).property("leetcode")); } )
            .attr("r", function(d){
                if(d3.select(d).property("leetcode")==0)
                    return 0;
                return 3;
            })
            .style("fill", "#dc400b")
            .style("stroke-width", "2px")
            .attr("stroke", "#cc400b")

        timeline_svg.append("g")
            .selectAll("tline")
            .data(total_leetcode_data)
            .enter()
            .append("line")
                .attr("transform", "translate(0, 0)")
                .attr("x1", function (d) { return progress_xScale(d3.select(d).property("date")); } )
                .attr("x2", function (d) { return progress_xScale(d3.select(d).property("date")); } )
                .attr("y1", function (d) { return progress_yScale(0); } )
                .attr("y2", function (d) { return progress_yScale(d3.select(d).property("leetcode")); } )
                // .attr("r", function(d){
                //     if(d3.select(d).property("leetcode")==0)
                //         return 0;
                //     return 3;
                // })
                .style("fill", "#dc400b")
                .style("stroke-width", "1px")
                .attr("stroke", "#cc400b")

        timeline_svg.append("g")
            .append("path")
            .datum(total_leetcode_data)
            .attr("fill", "none")
            .attr("stroke", "#cc400b")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                // .curve(d3.curveBumpX)
                .x(function(d) { return progress_xScale(d3.select(d).property("date")); })
                .y(function(d) { return progress_yScale(d3.select(d).property("leetcode")); })
            );
    });
});