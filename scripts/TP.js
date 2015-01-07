'use strict';

/**
 @typedef {Object} MetaData
 @property {string} descriptor - Constant string to identify, always "MesTeleTps_LearningExperimentDescription"
 @property {string} version - JSON version
 @property {string} author - Name of the teacher
 @property {MetaDataExperiment} experiment - Experiment
*/

/**
 @typedef {Object} MetaDataExperiment
 @property {string} name - Name of the experiment
 @property {string} description - Description for the students
 @property {string} objectives - Goal of the experiment
 @property {string} starting_date - Starting Date (YYYYMMDDHHmm)
 @property {string} ending_date - Ending Date (YYYYMMDDHHmm)
*/

/**
 @typedef {Object} Data
 @property {string} descriptor - Constant string to identify, always "MesTeleTps_LearningExperimentDescription"
 @property {string} version - JSON version
 @property {string} author - Name of the teacher
 @property {MetaDataExperiment} experiment - Experiment
 @property {Resource[]} resources - List of all network objects
 */

/**
 * Class constructor
 * @param {MetaData} newMetaData - Contains the meta data like name and description
 * @constructor
 */
function TP(newMetaData) {
    /** @type {MetaData} **/
    this.meta = newMetaData;
    /** @type {Resource[]} **/
    this.resources = [];
}

/**
 *
 * @returns {MetaData}
 */
TP.prototype.getMeta = function() {
    return this.meta;
};

/**
 *
 * @returns {string}
 */
TP.prototype.getName = function() {
    return this.meta.experiment.name;
};

/**
 *
 * @returns {Resource[]}
 */
TP.prototype.getNodes = function() {
    return this.resources;
};

/**
 *
 * @param {string} id
 * @returns {Resource}
 */
TP.prototype.getResourceById = function(id) {
    for(var r in this.resources) {
        if (this.resources[r].id === id) {
            return this.resources[r];
        }
    }
};

/**
 * Function to remove an element from an array
 * Array Remove - By John Resig (MIT Licensed) - adapted to be static
 * @param {Array} arr - Array
 * @param {number} from - starting index
 * @param {number} [to] - ending index
 * @returns {number} -
 */
function removeFromArray(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
}

/**
 *
 * @param {string} id
 */
TP.prototype.deleteNodeById = function(id) {
    for(var i = 0; i < this.resources.length; i++) {
        if (this.resources[i].id === id) {
            removeFromArray(this.resources, i);
        }
    }
};

/**
 *
 */
TP.prototype.resetFixed = function() {
    for(var i = 0; i < this.resources.length; i++) {
        if (this.resources[i].fixed !== undefined) {
            delete this.resources[i].fixed;
        }
    }
};

/**
 *
 * @returns {Array}
 */
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

/**
 *
 * @returns {Number}
 */
TP.prototype.getResourceSize = function() {
    return this.resources.length;
};

/**
 *
 * @param {Resource} res
 */
TP.prototype.addResource = function(res) {
    this.resources.push(res);
};

/**
 *
 * @param {number} index
 * @returns {Resource}
 */
TP.prototype.getResourceByIndex = function (index) {
    return this.resources[index];
};

/**
 *
 * @returns {string}
 */
TP.prototype.toJson = function() {
    /** @type {Data} **/
    var d = angular.copy(this.meta);
    d.descriptor = 'MesTeleTps_LearningExperimentDescription';
    d.version = "1.0";
    d.experiment.starting_date = moment(d.experiment.starting_date).format('YYYYMMDDHHmm');
    d.experiment.ending_date = moment(d.experiment.ending_date).format('YYYYMMDDHHmm');
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
        delete r.networkObjectIndex;
        if(r.type === 'switch') {
            delete r.function;
        }
        if(r.function !== 'terminal') {
            delete r.extra_modules;
        }
        for(var i = 0; i < r.network_interfaces.length; i++) {
            /** @type {number} **/
            var index = r.network_interfaces[i].endpointIndex;
            delete r.network_interfaces[i].endpointIndex;
            r.network_interfaces[i].endpoint = this.getResourceByIndex(index).getId();
        }
    }
    return JSON.stringify(d, null, 2);
};