'use strict';

/**
 @typedef {Object} NetworkObject
 @property {string} name - Name
 @property {string} type - Type
 @property {string} function - Function
 @property {string} image - Image as html img src compatible base64
 */

/**
 * Network Meta
 * @param {MetaData} newMeta
 * @constructor
 */
function NetworkInterface(newMeta) {

    /** @type {Resource} **/
    this.currentElement = undefined;
    /** @type {Resource} **/
    this.hoverElement = undefined;

    var container = $('#mainCanvas');

    /** @type {number} **/
    this.width = container.width();
    /** @type {number} **/
    this.height = container.height();
    /** @type {TP} **/
    this.tp = undefined;
    /** @type {number} **/
    this.timeSinceLastClick = 1000;

    var th = this;

    container.empty();

    $.getJSON('config.json', function(data) {
        /** @type {NetworkObject} **/
        th.networkObjectList = data.networkObjectList;
        /** @type {string[]} **/
        th.softwareList = data.softwareList;
    });

    this.svg = d3.select('#mainCanvas').append('svg')
        .attr('id', 'mainSvg')
        .attr('width', this.width)
        .attr('height', this.height)
        .on('dragover', function () { d3.event.preventDefault(); })
        .on('drop', function () {
            d3.event.preventDefault();
            var index = d3.event.dataTransfer.getData('index');
            if(index >= 0) { th.add(parseInt(index), d3.mouse(this)[0], d3.mouse(this)[1]); }
        });

    // Create main svg group
    this.g = this.svg.append('g');

    var jMainSvg = $('#mainSvg').attr('xmlns:svg', 'http://www.w3.org/2000/svg');
    jMainSvg.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    th.tp = new TP(newMeta);
}

/**
 * Resizes and adapts the svg object to the parent element
 * @param {number} [h] - height
 * @param {number} [w] - width
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

/**
 * Returns the currently selected element
 * @returns {undefined|*}
 */
NetworkInterface.prototype.getCurrentNode = function() {
    return this.currentElement;
};

/**
 * Deletes the interface of the current element and the given endpoint
 * @param {Resource} endpoint - Endpoint to delete
 */
NetworkInterface.prototype.deleteConnection = function(endpoint) {
    this.currentElement.deleteInterfaceByEndpoint(endpoint);
    // Not possible because endpoint is a copy
    // endpoint.deleteInterfaceByEndpoint(this.currentElement);
    this.tp.getEndpoint(endpoint).deleteInterfaceByEndpoint(this.currentElement);
    this.update();
    angular.element($('#settingsForm')).scope().reset();
};

/**
 * Converts the svg to a canvas and starts the download of a png file
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

/**
 * Converts the svg to a canvas and starts the download of a svg file
 */
NetworkInterface.prototype.downloadSvg = function() {

    var html = d3.select('svg')
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .node().parentNode.innerHTML;
    var blob = new Blob([html], {type: 'data:image/svg+xml;charset=utf-8'});
    saveAs(blob, this.tp.getMeta()['experiment']['name'] + '.svg');
};

/**
 * Generated and downloads the config file
 */
NetworkInterface.prototype.downloadConfig = function() {
    var blob = new Blob([this.tp.toJson()], {type: 'text/json;charset=utf-8'});
    saveAs(blob, this.tp.getName() + '.json');
};

/**
 * Creates a new object
 * @param {number} i - networkObjectList index
 * @param {number} [x] - X Position
 * @param {number} [y] - Y Position
 */
NetworkInterface.prototype.add = function(i, x, y) {
    var no = this.networkObjectList[i];
    var softwareCompliant = no.softwareCompliant || false;
    var res = new Resource(no.type,  no.name + (this.tp.getResourceSize() + 1), softwareCompliant, no.function, i);

    if(x !== undefined && y !== undefined) {
        res.setPosition(x, y);
    }
    this.tp.addResource(res);
    this.update();
};

/**
 * Updates / Draws the svg
 */
NetworkInterface.prototype.update = function() {
    var th = this;

    var line;
    var toggle = false;
    var startElement;

    // Delete all elements on the svg
    this.g.selectAll('*').remove();

    // Filter definition which is applied to the selected object
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

    // Initialize force layout
    var force = self.force = d3.layout.force()
        .nodes(this.tp.getNodes())
        .links(this.tp.getLinks())
        .size([this.width, this.height])
        .linkDistance([250])
        .charge([-1500])
        .gravity(0.3)
        .on('tick', tick)
        .start();

    // Define drag behaviour
    var node_drag = d3.behavior.drag()
        .on('dragstart', function(d) {
            d.fixed = true;
        })
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

    // Draw all the connections
    var edges = this.g.selectAll('line')
        .data(this.tp.getLinks())
        .enter()
        .append('line')
        .style('stroke', '#999')
        .style('stroke-width', 1);

    // One group per node
    var elem = this.g.selectAll('g')
        .data(this.tp.getNodes())
        .enter()
        .append('g');

    // Add one image per node
    var node = elem.append('image')
        .attr('width', 50)
        .attr('height', 50)
        .attr('xlink:href',function(d) {
            return th.networkObjectList[d.getNetworkObjectIndex()].image;
        })
        .on('mousedown', function(d) {
            th.currentElement = d;
            th.g.selectAll('image').style('filter', '');
            d3.select(this).style('filter', 'url(#dropshadow)');
            th.g.selectAll('image').sort(function (a, b) {
                if(a.id != d.id) return -1;
                else return 1;
            });
        })
        .on('click', function(d) {
            th.currentElement = d;
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
            var tpCreatorCanvasScope = angular.element($('#tpCreatorCanvas')).scope();
            tpCreatorCanvasScope.showSidebar(tpCreatorCanvasScope.TAB.SETTINGS);
            tpCreatorCanvasScope.reset();
            tpCreatorCanvasScope.$apply();
        })
        .call(node_drag);

    // Add one label per node
    var labels = elem.append('text')
        .attr('dy', '40')
        .attr('fill', 'black')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text(function(d) { return d.id; });

    // Draw function for the force layout
    // Only executed on elements with d.fixed = false
    function tick() {
        edges.attr('x1', function(d) { return d.source.x; })
             .attr('y1', function(d) { return d.source.y; })
             .attr('x2', function(d) { return d.target.x; })
             .attr('y2', function(d) { return d.target.y; });

        node.attr('x', function(d) { return d.x - 25; })
              .attr('y', function(d) { return d.y - 25; });

        labels.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    }

    // Define mouseup event for the svg
    th.svg.on('mouseup', mouseup);
    // Define contextmenu event for the svg
    th.svg.on('contextmenu', function() {
        th.hoverElement = null;
        d3.event.preventDefault();
        var settingsFormScope = angular.element($('#settingsForm')).scope();
        settingsFormScope.showSidebar(settingsFormScope.TAB.NEW);
    });


    function mouseup() {
        var tpCreatorCanvasScope = $('#tpCreatorCanvas');
        if(((new Date).getTime() - th.timeSinceLastClick) <= 250) {
            // Doubleclick event
            th.svg.on('mousemove', null);
            d3.event.preventDefault();
            //d3.event.stopPropagation();
            toggle = false;
            th.g.selectAll('.tempLine').remove();
            $('.tempLine').remove();
            angular.element(tpCreatorCanvasScope).scope().showSidebar(tpCreatorCanvasScope.scope().TAB.SETTINGS);
            angular.element(tpCreatorCanvasScope).scope().reset();
            angular.element(tpCreatorCanvasScope).scope().$apply();
        } else {
            th.timeSinceLastClick = (new Date).getTime();
            // Only create a new edge if left mousebutton is pressed
            if (d3.event.button === 0) {
                // Leftclick event
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
                            /** @type {Resource} **/
                            var startpoint = startElement;
                            /** @type {Resource} **/
                            var endpoint = th.hoverElement;

                            if (!startpoint.equals(endpoint)) {
                                var switchCount = 0;
                                if(startpoint.getType() == 'switch') {
                                    switchCount++;
                                }
                                if(endpoint.getType() == 'switch') {
                                    switchCount++;
                                }
                                if (switchCount == 1 && startpoint.getType() !== 'switch') {
                                    startpoint.addInterface(new Interface(endpoint, true));
                                }
                                if (switchCount == 1 && endpoint.getType() !== 'switch') {
                                    endpoint.addInterface(new Interface(startpoint, true));
                                }
                                // Update the sidebar
                                angular.element(tpCreatorCanvasScope).scope().reset();
                                angular.element(tpCreatorCanvasScope).scope().$apply();
                                th.update();
                            }
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
                        var settingsFormScope = angular.element($('#settingsForm')).scope();
                        settingsFormScope.hideSidebar();
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