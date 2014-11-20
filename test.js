var width =  $(document).width(),
    height = $(document).height();
var color = d3.scale.category20();
var circle;

// https://nyquist212.wordpress.com/2014/03/11/simple-d3-js-force-layout-example-in-less-than-100-lines-of-code/

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");
    //.attr("transform", "translate(32," + (height / 2) + ")");

    /*svg.append("svg:defs")
        .selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");*/

    /* Pre-Load the json data using the queue library */

    var nodes; // a global
    var links;

    d3.json("nodes.json", function(error, json) {
        if (error) return console.warn(error);
        nodes = json;
        d3.json("links.json", function(error, json) {
            if (error) return console.warn(error);
            links = json;
            makeDiag(nodes, links);

        });
    });

var stopForce = function() {
    circle.each(
        function(d) {
            d.fixed = true;
        }
    )
}

function makeDiag(nodes, links) {

    // Establish the dynamic force behavor of the nodes
    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width,height])
        .linkDistance([250])
        .charge([-1500])
        .gravity(0.3)
        .start();

    var edges = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);
        //.attr("marker-end", "url(#end)");

    /* Define the data for the circles */
    var elem = svg.selectAll("g")
        .data(nodes);

    /*Create and place the "blocks" containing the circle and the text */
    var elemEnter = elem.enter()
        .append("g");
        //.attr("transform", function(d){return "translate("+d.x+","+ d.y+")"})

    /*Create the circle for each block */
    //var circle = elemEnter.append("circle")
    //    .attr("r", 20)
    //    .attr("opacity", 0.5)
    //    .style("fill", function(d,i) { return color(i); })
    //    .call(force.drag);

    circle = elemEnter
        .append("svg:image")
        .attr('width', 50)
        .attr('height', 50)
        .attr("xlink:href",function(d) { return ("assets/" + d.type + ".png"); })
        .call(force.drag);


    /* Create the text for each block */
    var labels = elemEnter.append("text")
        .attr("dy", "40")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });





    /* Run the Force effect */
    force.on("tick", function() {
        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        elemEnter.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
        circle.attr("x", function(d) { return d.x - 25; })
            .attr("y", function(d) { return d.y - 25; })
        labels.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        stopForce();
    });


};