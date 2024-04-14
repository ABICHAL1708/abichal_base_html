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

    Promise.all([d3.csv("/src/data/progress.csv")]).then(value => {
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



// const width = svg.style('width');

// console.log(width)
// const height = +svg.style('height').replace('px','');

/*
// 3. margin is used for adding "padding" around the bar chart
const margin = { top:40, bottom: 90, right: 20, left: 80 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// 4. d3.csv does a GET request to the given URL (in this case a local file)
// Once it's loaded into the "data" object, we use an arrow function
// to run the code that creates the chart.
d3.csv('../data/population_by_country_2020.csv').then(data => {
    console.log(data);

    // 5. This is an example of how to sort JS arrays with a comparator function.
    // Try swapping the "a" and "b" in the compparison statement.
    data.sort(function(a,b) {
        return +b["Population (2020)"] - +a["Population (2020)"];
    });

    // 6. Only get the first 10 items in the array.
    data = data.slice(0,10);

    // 7. This bit of data wrangling makes it easier to reference the data.
    // You can use your browser's dev tools to see the items and their attributes
    data.forEach(d => {
        d.population = +d["Population (2020)"];
        d.country = d["Country (or dependency)"];
    });

    // 8. Create the scales for the bar chart.
    // The xScale is a "linear" scale and the yScale is a "band" scale.
    // Here's some tutorials on these scale types:
    // https://observablehq.com/@d3/d3-scalelinear
    // https://observablehq.com/@d3/d3-scaleband
    const xScale = d3.scaleLinear()
                        .domain([0, d3.max(data, function(d) {  return d.population; })]) // data space
                        .range([0,innerWidth]); // pixel space
    const yScale = d3.scaleBand()
                        .domain(data.map(function(d) { return d.country;}))
                        .range([0,innerHeight])
                        .padding(0.1);

    // 9. Append a 'g' element that's offset by the top and left margins.
    // The commented out line is an example of how to do this using Javascript 'string literals'.
    const g = svg.append('g')
                // .attr('transform', `translate(${margin.left}, ${margin.top})`);
                .attr('transform', 'translate('+margin.left+', '+margin.top+')');

    // // 10. This is what adds the rectangles in our bar chart.
    var barchart = g.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('y', d => yScale(d.country))
                    .attr('height',yScale.bandwidth())
                    .attr('width', function(d) {
                        return  xScale(d.population);
                    });

    // 11. Add the x-axis and y-axis with additional styling
    const yAxis = d3.axisLeft(yScale);
    g.append('g').call(yAxis)
                 .selectAll('.domain, .tick line').remove(); // remove the y-axis line and tick marks using this 'selectAll' command
               
    const xAxisTickFormat = function(d) { 
//             // You can use this link to look at d3.format options: 
//             // http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e
            return d3.format('.3s')(d).replace('G','B') 
    }
    const xAxis = d3.axisBottom(xScale)
                    // make the x-axis labels nicer using a custom tick format function
                    .tickFormat(xAxisTickFormat)
//                     // extend the x-axis tick marks backwards to the top of the chart
                    .tickSize(-innerHeight);                
    var gXAxis = g.append('g').call(xAxis);
// //     // remove the x-axis line 
    gXAxis.selectAll('.domain').remove();                   
    gXAxis.attr('transform',`translate(0,${innerHeight})`)
                    .selectAll("text")                   // If you want to rotate the axis text,
                        .style("text-anchor", "end")     // select it with the selectAll call and
                        .attr("dx", "-10px")             // and slightly shift it (using dx, dy)
                        .attr("dy", "0px")               // and then rotate it.
                        .attr("transform", "rotate(-45)" );
    
    

//     // 12. Label the x-axis and add a title
//     // Note that we're using CSS to help style both these 
//     // components and the x-axis tick marks.
    g.append('text')
        .attr('class','axis-label')
        .attr('text-anchor','middle')
        .attr('x',innerWidth/2)
        .attr('y',innerHeight+70)
        .text('Population')    
    g.append('text')
        .attr('class','title')
        .attr('y',-10)
        .text('The top 10 most populous countries');
        
});
*/