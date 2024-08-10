var kde = kernelDensityEstimator(kernelEpanechnikov(0.0003), progress_xScale.ticks(50));
var density = kde(total_leetcode_data.map(function(d){ return d.date.getTime(); }));

console.log(density)

timeline_svg.append("g")
    .append("path")
    .datum(density)
    .attr("stroke", "#cc400b")
    .attr("stroke-width", 1.5)
    .attr("fill", "#cc400b")
    .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return progress_xScale(d[0]); })
        .y(function(d) { return progress_yScale(d[1]); })
    );

// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}