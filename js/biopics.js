window.onload = (function () {
    var height = 500;
    var width = 1500;

    d3.csv("./resources/biopics.csv", function(data){
        var manipulated = manipulateData(data);
        var body = d3.select("body");

        var svg = body.append("svg")
            .attr("width", width)
            .attr("height", height);

        makeGraphics(manipulated, svg);

    });

    function manipulateData(data)
    {
        var manipulated = data;
        var copies = {};
        var year = "";

        for (i = 0; i < data.length; ++i) {
            year = data[i].year_release.toString();
            if (!(year in copies)) {
                copies[year] = 1;
            } else {
                copies[year]++;
            }
            manipulated[i].count = copies[year];
        }

        return manipulated;
    }

    function makeGraphics(data, svgT)
    {
        var rightPadding = 100;
        var leftPadding = 20;
        var topPadding = 50;
        var bottomPadding = 20;

        var xMin = d3.min(data, function(d) {
            return d.year_release;
        });

        var xMax = d3.max(data, function(d) {
            return d.year_release;
        });

        var yMin = d3.min(data, function(d) {
            return d.count;
        });

        var yMax = d3.max(data, function(d) {
            return d.count;
        });

        var xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([leftPadding, width - rightPadding]);

        /*
        var xScale = d3.scaleBand()
            .domain(d3.range(xMin, xMax))
            .rangeRound([0, width])
            .padding(20);
            */

        var yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([bottomPadding, height - topPadding]);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"))
            .ticks(20);

        svgT.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return xScale(d.year_release);
            })
            .attr("cy", function(d) {
                return height - (yScale(d.count) + bottomPadding);
            })
            .attr("r", 5)
            .attr("opacity", 1)
            .on("mouseover", function(d) {
                var mouse = this;
                svgT.selectAll("circle")
                    .filter(function () {
                        return mouse != this;
                    })
                .transition()
                .duration(250)
                .attr("opacity", 0.5);

                var xPos = parseFloat(d3.select(this).attr("cx")) + 7;
                var yPos = parseFloat(d3.select(this).attr("cy")) + 3;

                svgT.append("text")
                    .attr("id", "movie-info")
                    .attr("x", xPos)
                    .attr("y", yPos)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("font-weight", "bold")
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("stroke-width", "4")
                    .attr("paint-order", "stroke")
                    .text(d.title)
                    .attr("class", "movie-text");
            })
            .on("mouseout", function() {
                d3.selectAll("circle")
                    .transition()
                    .duration(250)
                    .attr("opacity", 1);

                d3.select("#movie-info").remove();
            });

        svgT.append("g")
            .attr("transform", "translate(0, " + (height - bottomPadding) + ")")
            .call(xAxis);
    }
}) ();
