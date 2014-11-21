"use strict";

var width, height, svg, forceStopped, dataset, currentElement, hoverElement, currentD3Element;


function loadD3() {

    var container = $("#mainCanvas");

    width = container.width();
    height = container.height();

    forceStopped = false;

    container.empty();
    dataset = { nodes : undefined, links : undefined};
    svg = d3.select("#mainCanvas").append("svg")
        .attr('id', 'mainSvg')
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
            update();
        });
    });

}

function resize() {
    var container = $("#mainCanvas");
    var x = container.width();
    var y = container.height();

    d3.select("#mainSvg").attr("width", x).attr("height", y);
}

d3.select(window).on('resize', resize);


function addRouter() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    var newNode = {
        code : "Objet-" + l,
        count : l,
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
    dataset['links'].push(newLinks);

    update();
}

function addComputer() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    var newNode = {
        code : "Objet-" + l,
        count : l,
        connectedTo : [],
        gateway : "0.0.0.0",
        ip : "0.0.0.0",
        name : "Ordinateur",
        netmask : "0.0.0.0",
        type : "pc"
    };

    var newLinks = {
        "source": l,
        "target": l
    };
    dataset['nodes'].push(newNode);
    dataset['links'].push(newLinks);

    update();
}

function addSwitch() {
    var nodes;
    var links;

    var l = dataset['nodes'].length;
    var newNode = {
        code : "Objet-" + l,
        count : l,
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

    update();
}


function update() {

    var nodes = dataset['nodes'];
    var links = dataset['links'];

    svg.selectAll("*").remove();

    // Establish the dynamic force behavor of the nodes
    var force = self.force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width,height])
        .linkDistance([250])
        .charge([-1500])
        .gravity(0.3)
        .on("tick", tick)
        .start();

    var node_drag = d3.behavior.drag()
        .on("dragstart", function(d, i) { force.stop(); })
        .on("dragend", function(d, i) {
            d.fixed = true;
            tick();
        })
        .on("drag", function(d, i) {
            vis.on("mouseup", null);

            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;

            tick();
        });

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
        .on('mousedown', function(d) { currentD3Element = this; })
        .on('mousedown', function(d) { vis.on("mouseup", mouseup); })
        .on("click", function(d) {
            currentElement = dataset['nodes'][d.count];
            $('#settings').html(JSON.stringify(currentElement));
        })
        .on("mouseenter", function(d) {
            hoverElement = d;
        })
        .on("mouseleave", function(d) {
            hoverElement = null;
        })
        .call(node_drag);



    var labels = elemEnter.append("text")
        .attr("dy", "40")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });

    function tick() {
        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        elemEnter.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        circle.attr("x", function(d) { return d.x - 25; })
            .attr("y", function(d) { return d.y - 25; });

        labels.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    }

    var line;
    var toggle = false;
    var startElement;

    var vis = d3.select("body").select("svg");

    vis.on("mouseup", mouseup);


    function mouseup() {
        var m = d3.mouse(this);
        line = vis.select('g').append("line")
            .attr('class', 'tempLine')
            .attr("x1", m[0])
            .attr("y1", m[1])
            .attr("x2", m[0])
            .attr("y2", m[1])
            .style("stroke", "#ccc")
            .style("stroke-width", 1);

        if(toggle) {
            toggle = false;
            vis.on("mousemove", null);
            if(hoverElement !== null && hoverElement !== undefined) {
                line.attr('class', 'line');
                var newLink = {
                    "source": startElement.count,
                    "target": hoverElement.count
                };
                var found = false;

                for(var i = 0; i < dataset['links'].length; i++) {
                    if ((dataset['links'][i].source.count == newLink.source &&
                        dataset['links'][i].target.count == newLink.target) ||
                        (dataset['links'][i].target.count == newLink.source &&
                        dataset['links'][i].source.count == newLink.target)) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    dataset['links'].push(newLink);
                    update();
                } else {
                    vis.select('g').selectAll('.tempLine').remove();
                    $('.tempLine').remove();
                }
            } else {
                vis.select('g').selectAll('.tempLine').remove();
                $('.tempLine').remove();
            }
        } else {
            if(hoverElement !== null) {
                toggle = true;
                startElement = hoverElement;
                vis.on("mousemove", mousemove);
            }

        }


    }

    function mousemove() {
        var m = d3.mouse(this);
        line.attr("x2", m[0]-1)
            .attr("y2", m[1]-1);
    }


}