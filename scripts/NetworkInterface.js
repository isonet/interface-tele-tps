'use strict';

/**
 * Class Constructor
 */
function NetworkInterface() {

    this.currentElement = undefined;
    this.hoverElement = undefined;

    var container = $('#mainCanvas');

    this.width = container.width();
    this.height = container.height();
    this.tp = undefined;

    this.timeSinceLastClick = 1000;

    container.empty();
    var th = this;

    this.svg = d3.select('#mainCanvas').append('svg')
        .attr('id', 'mainSvg')
        .attr('width', this.width)
        .attr('height', this.height)
        .on('drop', function () {
            d3.event.preventDefault();
            var name = d3.event.dataTransfer.getData('name');
            th.add(name, d3.mouse(this)[0], d3.mouse(this)[1]);
        })
        .on('dragover', function () {
            d3.event.preventDefault();
        });
    this.g = this.svg.append('g');

    var jMainSvg = $('#mainSvg').attr('xmlns:svg', 'http://www.w3.org/2000/svg');
    jMainSvg.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    d3.json('data/exemple.json', function (error, json) {
        if (error) return console.warn(error);
        th.tp = new TP(json);
        th.update();
    });

    var svgToPng = $('#svgToPng').attr('height', this.height);
    svgToPng.attr('width', this.width);
}

/**
 * Resizes and adapts the svg object to the parent element
 */
NetworkInterface.prototype.resize = function(h, w) {

    var jMainCanvas = $('#mainCanvas');

    this.height = h || jMainCanvas.height();
    this.width = w || jMainCanvas.width();

    d3.select('#mainSvg').attr('height', this.height).attr('width', this.width);

    if(this.tp !== undefined) {
        this.tp.resetFixed();
        this.update();
    }
};

NetworkInterface.prototype.getCurrentNode = function() {
    return this.currentElement;
};

/**
 * Converts the svg to a canvas and generates a png file
 */
NetworkInterface.prototype.downloadImage = function() {

    var th = this;

    var html = d3.select('svg')
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .node().parentNode.innerHTML;

    var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);

    var canvas = document.querySelector('canvas');
    canvas.height = this.height * 5;
    canvas.width = this.width * 5;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    var image = new Image;
    image.src = imgsrc;

    image.onload = function() {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
            saveAs(blob, th.tp.getMeta()['experiment']['name'] + '.png');
        });
    };
};

NetworkInterface.prototype.downloadSvg = function() {

    var html = d3.select('svg')
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .node().parentNode.innerHTML;
    var blob = new Blob([html], {type: 'data:image/svg+xml;charset=utf-8'});
    saveAs(blob, this.tp.getMeta()['experiment']['name'] + '.svg');
};

NetworkInterface.prototype.downloadConfig = function() {
    var blob = new Blob([this.tp.toJson()], {type: 'text/json;charset=utf-8'});
    saveAs(blob, this.tp.getMeta()['experiment']['name'] + '.json');
};

/**
 * Creates a new object
 * @param {string} t - (router, switch, pc)
 * @param {number} [x] - X Position
 * @param {number} [y] - Y Position
 */
NetworkInterface.prototype.add = function(t, x, y) {

    var type = Resource.typeBuilder(t, this.tp.getResourceSize());
    var res = new Resource(type.type, type.name, type.func);

    if(x !== undefined && y !== undefined) {
        res.setPosition(x, y);
    }
    this.tp.addResource(res);
    this.update();
};

/**
 * Updates / Draws the svg with objects from dataset
 */
NetworkInterface.prototype.update = function() {
    var th = this;

    var line;
    var toggle = false;
    var startElement;

    this.g.selectAll('*').remove();

    // TODO Integrate into html directly
    // Filter which is applied to the selected object
    var defs = this.g.append('defs');
    var filter = defs.append('filter')
        .attr('id', 'dropshadow')
        .attr('height', '130%');
    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 3);
    filter.append('feOffset')
        .attr('dx', 2)
        .attr('dy', 2)
        .attr('result', 'offsetblur');
    var feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

    var force = self.force = d3.layout.force()
        .nodes(this.tp.getNodes())
        .links(this.tp.getLinks())
        .size([this.width, this.height])
        .linkDistance([250])
        .charge([-1500])
        .gravity(0.3)
        .on('tick', tick)
        .start();

    var node_drag = d3.behavior.drag()
        .on('dragstart', function() { force.stop(); })
        .on('dragend', function(d) {
            d.fixed = true;
            tick();
        })
        .on('drag', function(d) {
            th.svg.on('mouseup', null);
            if (d3.event.x >= th.width) {
                d.x = th.width;
            } else if (d3.event.x <= 0) {
                d.x = 0;
            } else {
                d.x += d3.event.dx;
            }
            if (d3.event.y >= th.height) {
                d.y = th.height;
            } else if (d3.event.y <= 0) {
                d.y = 0;
            } else {
                d.y += d3.event.dy;
            }
            d.px = d.x;
            d.py = d.y;
            tick();
        });

    var edges = this.g.selectAll('line')
        .data(this.tp.getLinks())
        .enter()
        .append('line')
        .style('stroke', '#999')
        .style('stroke-width', 1);

    var elem = this.g.selectAll('g')
        .data(this.tp.getNodes());

    var elemEnter = elem.enter()
        .append('g');

    var node = elemEnter
        .append('image')
        .attr('width', 50)
        .attr('height', 50)
        .attr('xlink:href',function(d) { return d.getImageUrl(); })
        .on('mousedown', function(d) {
            th.currentElement = th.tp.getResourceByIndex(d.index);
            th.g.selectAll('image').style('filter', '');
            d3.select(this).style('filter', 'url(#dropshadow)');
            th.g.selectAll('image').sort(function (a, b) {
                if(a.id != d.id) return -1;
                else return 1;
            });
        })
        .on('click', function(d) {
            th.currentElement = th.tp.getResourceByIndex(d.index);
            th.svg.on('mouseup', mouseup);
        })
        .on('mouseenter', function(d) {
            th.hoverElement = d;
        })
        .on('mouseleave', function() {
            th.hoverElement = null;
        })
        .on('contextmenu',function () {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            var jTpCreatorCanvas = $('#tpCreatorCanvas');
            angular.element(jTpCreatorCanvas).scope().toggleSidebar(true, 'settings');
            angular.element(jTpCreatorCanvas).scope().reset();
            angular.element(jTpCreatorCanvas).scope().$apply();
        })
        .call(node_drag);

    var labels = elemEnter.append('text')
        .attr('dy', '40')
        .attr('fill', 'black')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text(function(d) { return d.id; });

    function tick() {
        edges.attr('x1', function(d) { return d.source.x; })
             .attr('y1', function(d) { return d.source.y; })
             .attr('x2', function(d) { return d.target.x; })
             .attr('y2', function(d) { return d.target.y; });

        node.attr('x', function(d) { return d.x - 25; })
              .attr('y', function(d) { return d.y - 25; });

        labels.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    }

    th.svg.on('mouseup', mouseup);
    th.svg.on('contextmenu', function() {
        th.hoverElement = null;
        d3.event.preventDefault();
        angular.element($('#settingsForm')).scope().toggleSidebar(true, 'components');
    });


    function mouseup() {
        if(((new Date).getTime() - th.timeSinceLastClick) <= 250) {
            d3.event.preventDefault();
            d3.event.stopPropagation();
            toggle = false;
            th.g.selectAll('.tempLine').remove();
            $('.tempLine').remove();
            var jTpCreatorCanvas = $('#tpCreatorCanvas');
            angular.element(jTpCreatorCanvas).scope().toggleSidebar(true, 'settings');
            angular.element(jTpCreatorCanvas).scope().reset();
            angular.element(jTpCreatorCanvas).scope().$apply();
        } else {
            th.timeSinceLastClick = (new Date).getTime();
            // Only create a new edge if left mousebutton is pressed
            if (d3.event.button === 0) {
                var m = d3.mouse(this);
                line = th.g.append('line')
                    .attr('class', 'tempLine')
                    .attr('x1', m[0])
                    .attr('y1', m[1])
                    .attr('x2', m[0])
                    .attr('y2', m[1])
                    .style('stroke', '#0f9d58')
                    .style('stroke-width', 1);

                if (toggle) {
                    toggle = false;
                    th.svg.on('mousemove', null);
                    if (th.hoverElement !== null && th.hoverElement !== undefined) {
                        line.attr('class', 'line');
                        try {
                            // TODO Refactor, it's ugly as hell
                            var startpoint = startElement;
                            var endpoint = th.hoverElement;
                            if (startpoint.getType() === 'switch') {
                                startpoint = th.hoverElement;
                                endpoint = startElement;
                            }
                            startpoint.addInterface(new Interface(endpoint.getId(), true));
                            th.update();
                        } catch (ex) {
                            th.g.selectAll('.tempLine').remove();
                            $('.tempLine').remove();
                        }
                    } else {
                        th.g.selectAll('.tempLine').remove();
                        $('.tempLine').remove();
                    }
                } else {
                    if (th.hoverElement !== null) {
                        toggle = true;
                        startElement = th.hoverElement;
                        th.svg.on('mousemove', mousemove);
                    } else {
                        angular.element($('#settingsForm')).scope().toggleSidebar(false);
                    }
                }
            }
        }
    }

    function mousemove() {
        var m = d3.mouse(this);
        line.attr('x2', m[0]-1)
            .attr('y2', m[1]-1);
    }
};