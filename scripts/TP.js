'use strict';

//TODO Implement toString https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString

/**
 * Constructor
 * @param {Object} json
 * @constructor
 */
function TP(newMeta) {
    this.meta = newMeta;
    this.resources = [];
}

TP.prototype.getMeta = function() {
    return this.meta;
};

TP.prototype.getName = function() {
    return this.meta.experiment.name;
};

TP.prototype.getNodes = function() {
    return this.resources;
};

TP.prototype.getResourceById = function(id) {
    for(var r in this.resources) {
        if (this.resources[r].id === id) {
            return this.resources[r];
        }
    }
};

// Array Remove - By John Resig (MIT Licensed)
function removeFromArray(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
}

TP.prototype.deleteNodeById = function(id) {
    for(var i = 0; i < this.resources.length; i++) {
        if (this.resources[i].id === id) {
            removeFromArray(this.resources, i);
        }
    }
};

TP.prototype.resetFixed = function() {
    for(var i = 0; i < this.resources.length; i++) {
        if (this.resources[i].fixed !== undefined) {
            delete this.resources[i].fixed;
        }
    }
};

TP.prototype.getLinks = function() {
    var links = [];
    for(var i = 0; i < this.resources.length; i++){
        var l = this.resources[i].getConnectedNodes(this, i);
        if(l.length > 0) {
            links = links.concat(l);
        }
    }
    return links;
};

TP.prototype.getResourceSize = function() {
    return this.resources.length;
};

TP.prototype.addResource = function(res) {

    this.resources.push(res);
};

TP.prototype.getResourceByIndex = function (index) {
    return this.resources[index];
};

TP.prototype.toJson = function() {

    var d = angular.copy(this.meta);
    d.descriptor = 'MesTeleTps_LearningExperimentDescription';
    d.version = "1.0";
    d.resources = angular.copy(this.resources);
    for(var res in d.resources) {
        var r = d.resources[res];
        delete r.x;
        delete r.y;
        delete r.px;
        delete r.py;
        delete r.index;
        delete r.weight;
        delete r.fixed;
        if(r.type === 'switch') {
            delete r.function;
        }
    }
    return JSON.stringify(d, null, 2);
};