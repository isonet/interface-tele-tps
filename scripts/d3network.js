"use strict";


// TODO Why do I have two currentElement?!
function NetworkInterface() {
    this.width;
    this.height;
    this.svg;
    this.forceStopped;
    this.dataset;
    this.currentElement;
    this.hoverElement;
    this.currentD3Element;

    this.defaultRouter = { connectedTo : [], gateway : "0.0.0.0", ip : "0.0.0.0", name : "Router", netmask : "0.0.0.0",
        type : "Router", forwarding : true };
    this.defaultPC = { connectedTo : [], gateway : "0.0.0.0", ip : "0.0.0.0", name : "Ordinateur", netmask : "0.0.0.0",
        type : "PC" };
    this.defaultSwitch = { connectedTo : [], gateway : "0.0.0.0", ip : "0.0.0.0", name : "Switch", netmask : "0.0.0.0",
        type : "Switch" };
}

NetworkInterface.prototype.load = function() {

    var th = this;

    var container = $("#mainCanvas");

    this.width = container.width();
    this.height = container.height();

    this.forceStopped = false;

    container.empty();
    this.dataset = { nodes : Object, links : Object};
    this.svg = d3.select("#mainCanvas").append("svg")
        .attr('id', 'mainSvg')
        .attr("width", this.width)
        .attr("height", this.height)
        .on('drop', function(d) {
            var name = d3.event.dataTransfer.getData('name');
            th.add(name, d3.mouse(this)[0], d3.mouse(this)[1]);
        })
        .on('dragover', function(d) { d3.event.preventDefault(); })
        .append("g");

    //$('#mainSvg').attr("xmlns", "http://www.w3.org/2000/svg");
    $('#mainSvg').attr("xmlns:svg", "http://www.w3.org/2000/svg");
    $('#mainSvg').attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

    d3.json("data/nodes.json", function (error, json) {
        if (error) return console.warn(error);
        var nodes = json;
        d3.json("data/links.json", function (error, json) {
            if (error) return console.warn(error);
            var links = json;
            th.dataset['nodes'] = nodes;
            th.dataset['links'] = links;
            th.update();
        });
    });

    $("#svgToPng").attr('height', $("#mainSvg").height());
    $("#svgToPng").attr('width', $("#mainSvg").width());

};

NetworkInterface.prototype.resize = function() {
    var container = $("#mainCanvas");
    var x = container.width();
    var y = container.height();

    d3.select("#mainSvg").attr("width", x).attr("height", y);
    //this.update();
};

NetworkInterface.prototype.downloadImage = function() {
    var html = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
    var img = '<img src="'+imgsrc+'">';
    d3.select("#svgdataurl").html(img);


    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {
        context.drawImage(image, 0, 0);

        var canvasdata = canvas.toDataURL("image/png");

        var pngimg = '<img src="'+canvasdata+'">';
        d3.select("#pngdataurl").html(pngimg);

        var a = document.createElement("a");
        // TODO add name of TP
        a.download = "topologie.png";
        a.href = canvasdata;
        a.click();
    };

};

NetworkInterface.prototype.editSettings = function(name, type, ip, netmask, gateway, forwarding) {

    var oldType = this.currentElement.type;

    this.currentElement.name = name;
    this.currentElement.type = type;
    this.currentElement.ip = ip;
    this.currentElement.netmask = netmask;
    this.currentElement.gateway = gateway;
    this.currentElement.forwarding = forwarding;

    this.dataset['nodes'][this.currentElement.count] = this.currentElement;

    if(oldType !== this.currentElement.type) {
        this.update();
    }
};

NetworkInterface.prototype.add = function(type, x, y) {
    var newNode;

    switch (type) {
        case "switch":
            newNode = jQuery.extend({}, this.defaultSwitch);
            break;
        case "router":
            newNode = jQuery.extend({}, this.defaultRouter);
            break;
        default:
            newNode = jQuery.extend({}, this.defaultPC);
            break;
    }

    var l = this.dataset['nodes'].length;
    newNode.code =  "Objet-" + l;
    newNode.count = l;

    if(x !== undefined && y !== undefined) {
        newNode.x = x;
        newNode.y = y;
        newNode.fixed = true;
    }

    var newLinks = {
        "source": l,
        "target": l
    };

    this.dataset['nodes'].push(newNode);
    this.dataset['links'].push(newLinks);

    this.update();
};

NetworkInterface.prototype.update = function() {

    var th = this;

    var line;
    var toggle = false;
    var startElement;

    var nodes = this.dataset['nodes'];
    var links = this.dataset['links'];

    this.svg.selectAll("*").remove();

    var defs = this.svg.append("defs");
    var filter = defs.append("filter")
        .attr("id", "dropshadow")
        .attr("height", "130%");
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3);
    filter.append("feOffset")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetblur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    // Establish the dynamic force behavor of the nodes
    var force = self.force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([this.width, this.height])
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

            // Prevent elements from getting outside the svg element
            if(d3.event.x > 25 && d3.event.x < th.width - 25 && d3.event.y > 25 && d3.event.y < th.height - 25) {
                d.px += d3.event.dx;
                d.py += d3.event.dy;
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                tick();
            }
        });

    var edges = this.svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    var elem = this.svg.selectAll("g")
        .data(nodes);

    var elemEnter = elem.enter()
        .append("g");

    var circle = elemEnter
        .append("image")
        .attr('width', 50)
        .attr('height', 50)
        .attr("xlink:href",function(d) { return (window.images[d.type.toLowerCase()]); })
        .on('mousedown', function(d) {
            th.currentElement = th.dataset['nodes'][d.count];
            th.currentD3Element = this;
            th.svg.selectAll('image').style('filter', '');
            d3.select(this).style("filter", "url(#dropshadow)");
        })
        .on("click", function(d) {
            th.currentElement = th.dataset['nodes'][d.count];
            vis.on("mouseup", mouseup);
        })
        .on("mouseenter", function(d) {
            th.hoverElement = d;
        })
        .on("mouseleave", function(d) {
            th.hoverElement = null;
        })
        .on('contextmenu',function (d,i) {
            angular.element($('#settingsForm')).scope().updateSettings(d);
            angular.element($('#settingsForm')).scope().$apply();
            th.hoverElement = null;
            d3.event.preventDefault();
            d3.event.stopPropagation();
            window.toggleSidebar(true, 'settings');
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



    var vis = d3.select("body").select("svg");

    vis.on("mouseup", mouseup);
    vis.on('contextmenu', function() {
        th.hoverElement = null;
        d3.event.preventDefault();
        window.toggleSidebar(true, 'components');
    });


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
            if(th.hoverElement !== null && th.hoverElement !== undefined) {
                line.attr('class', 'line');
                var newLink = {
                    "source": startElement.count,
                    "target": th.hoverElement.count
                };
                var found = false;

                for(var i = 0; i < th.dataset['links'].length; i++) {
                    if ((th.dataset['links'][i].source.count == newLink.source &&
                        th.dataset['links'][i].target.count == newLink.target) ||
                        (th.dataset['links'][i].target.count == newLink.source &&
                        th.dataset['links'][i].source.count == newLink.target)) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    th.dataset['links'].push(newLink);
                    th.update();
                } else {
                    vis.select('g').selectAll('.tempLine').remove();
                    $('.tempLine').remove();
                }
            } else {
                vis.select('g').selectAll('.tempLine').remove();
                $('.tempLine').remove();
            }
        } else {
            if(th.hoverElement !== null) {
                toggle = true;
                startElement = th.hoverElement;
                vis.on("mousemove", mousemove);
            }

        }


    }

    function mousemove() {
        var m = d3.mouse(this);
        line.attr("x2", m[0]-1)
            .attr("y2", m[1]-1);
    }


};