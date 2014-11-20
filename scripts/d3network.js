"use strict;"

var width, height, svg, forceStopped, dataset;


function loadD3() {

    width = $('#mainCanvas').width();
    height = $('#mainCanvas').height();

    forceStopped = false;

    $('#mainCanvas').empty();
    dataset = { nodes : undefined, links : undefined};
    svg = d3.select("#mainCanvas").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");


    d3.json("data/nodes.json", function (error, json) {
        if (error) return console.warn(error);
        var nodes = json;
        d3.json("data/links.json", function (error, json) {
            if (error) return console.warn(error);
            var links = json;
            dataset['nodes'] = nodes;
            dataset['links'] = links;
            update(nodes, links, true);
        });
    });

}

function stopForce() {
    forceStopped = true;
}

function addRouter() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    var newNode = {
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
    dataset['nodes'].push(newNode);
    dataset['links'].push(newLinks)

    update(dataset['nodes'], dataset['links']);
}

function addComputer() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    var newNode = {
        code : "Objet-" + l,
        connectedTo : [],
        gateway : "0.0.0.0",
        ip : "0.0.0.0",
        name : "Ordninateur",
        netmask : "0.0.0.0",
        type : "pc"
    };

    var newLinks = {
        "source": l,
        "target": l
    };
    dataset['nodes'].push(newNode);
    dataset['links'].push(newLinks)

    update(dataset['nodes'], dataset['links']);
}

function addSwitch() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    var newNode = {
        code : "Objet-" + l,
        connectedTo : [],
        gateway : "0.0.0.0",
        ip : "0.0.0.0",
        name : "Switch",
        netmask : "0.0.0.0",
        type : "switch"
    };

    var newLinks = {
        "source": l,
        "target": l
    };
    dataset['nodes'].push(newNode);
    dataset['links'].push(newLinks);

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