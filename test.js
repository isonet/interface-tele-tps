var width =  $(document).width(),
    height = $(document).height();
var color = d3.scale.category20();

var forceStopped = false;
var dataset = { nodes : undefined, links : undefined};

// https://nyquist212.wordpress.com/2014/03/11/simple-d3-js-force-layout-example-in-less-than-100-lines-of-code/

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");



    d3.json("nodes.json", function(error, json) {
        if (error) return console.warn(error);
        var nodes = json;
        d3.json("links.json", function(error, json) {
            if (error) return console.warn(error);
            var links = json;
            dataset['nodes'] = nodes;
            dataset['links'] = links;
            update(nodes, links, true);
        });
    });

function stopForce() {
    forceStopped = true;
}

function addRouter() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    console.log(l);
    var newRouter = {
        code : "Objet-" + l,
        connectedTo : [],
        gateway : "0.0.0.0",
        ip : "0.0.0.0",
        name : "Router",
        netmask : "0.0.0.0",
        type : "router"
    };

    var newLinks = {
        "source": l,
        "target": l
    };
    dataset['nodes'].push(newRouter);
    dataset['links'].push(newLinks)

    update(dataset['nodes'], dataset['links']);

}


function update(nodes, links, first) {

    svg.selectAll("*").remove();

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

    var elem = svg.selectAll("g")
        .data(nodes);

    var elemEnter = elem.enter()
        .append("g");

    var circle = elemEnter
        .append("svg:image")
        .attr('width', 50)
        .attr('height', 50)
        .attr("xlink:href",function(d) { return ("assets/" + d.type + ".png"); })
        .call(force.drag);

    var labels = elemEnter.append("text")
        .attr("dy", "40")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        elemEnter.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        circle.each(function(d) {
            if(forceStopped) {
                d.fixed = true;
            }
        });

        circle.attr("x", function(d) { return d.x - 25; })
            .attr("y", function(d) { return d.y - 25; });

        labels.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        stopForce();
    });


}