// Initializing Global Variables
// Data Variable
var leetcode_data;

// SVG element
var progress_svg;

document.addEventListener("DOMContentLoaded", function() {
    // Select the svg element
    progress_svg = d3.select("#progress_svg");
    console.log(progress_svg.node());

    const progress_g = progress_svg.append("g")

    // Dimension data of progress svg
    const width = parseInt(progress_svg.style("width").replace("px", ""));
    const height = parseInt(progress_svg.style("height").replace("px", ""));
    
    const innerWidth = 800;
    const innerHeight = height - margin.top - margin.bottom;

    // AXES
    // X axis
    const progress_xScale = d3.scaleTime()
        .range([+margin.left, innerWidth])

    // Y axis
    const progress_yScale = d3.scaleLinear()
        .range([+margin.bottom, innerHeight])

    // Append Axes to svg
    // Append x Axis
    progress_g.append("g")
        .call(d3.axisBottom(progress_xScale))
        .attr("class", "progressXScale")
        .attr('transform',`translate(0, ${innerHeight})`);

    // Append y Axis
    progress_g.append("g")
        .call(d3.axisLeft(progress_yScale))
        .attr("class", "progressYScale")
        .attr('transform', `translate(${margin.left}, 0)`);

    Promise.all([d3.csv("src/data/progress.csv")]).then(value => {
        progress_data = value[0];

        // Data wrangling for progress data
        progress_data.forEach(d =>{
            d.leetcode = +d["Leetcode"];
            d.date = parseTime(d["Date"]);
        });

        leetcode_data = progress_data;

        total = 0

        for(let i=0; i<leetcode_data.length; i++){
            total+=leetcode_data[i]["leetcode"];
            leetcode_data[i]["total_leetcode"] = total;
        }

        console.log(leetcode_data);

        // Animate Scales
        // Set domain of axes
        progress_xScale.domain([d3.min(progress_data, function(d) {  return d.date; }), d3.max(progress_data, function(d) {  return d.date; })])
        progress_yScale.domain([d3.max(progress_data, function(d) {  return d.total_leetcode; }), 0])
        
        // Transition of axes
        progress_svg.selectAll(".progressXScale").transition()
            .duration(1000)
            .call((d3.axisBottom(progress_xScale)));

        progress_svg.selectAll(".progressYScale").transition()
                .duration(1000)
                .call((d3.axisLeft(progress_yScale)));

        progress_svg.append("g")
            .append("path")
            .datum(leetcode_data)
            .attr("fill", "none")
            .attr("stroke", "#cc400b")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return progress_xScale(d3.select(d).property("date")); })
              .y(function(d) { return progress_yScale(d3.select(d).property("total_leetcode")); })
            );
    });
});