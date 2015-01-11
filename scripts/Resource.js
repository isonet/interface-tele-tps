'use strict';

/**
 @typedef {Object} Link
 @property {Resource} source - The source Resource
 @property {Resource} target - The target Resource
 */

/**
 *
 * @property {string} type - Main type of the resource
 * @property {string} function - Subtype of the resource
 * @property {string} id - Unique resource identifier
 * @property {number} cpu - Number of CPUs (optional)
 * @property {string} ram_size - Virtual memory size (optional)
 * @property {string} free_space_size - Free hard drive space (optional)
 * @property {Interface[]} network_interfaces - List of network interfaces (optional)
 * @property {boolean} softwareCompliant - If true, modules from extra_modules can be installed
 * @property {string[]} extra_modules - List of software modules, only allowed if softwareCompliant (optional)

 * @param {string} type - Main type of the resource
 * @param {string} id - Unique resource identifier
 * @param {boolean} softwareCompliant - If true, modules from extra_modules can be installed
 * @param {string} [func] - Subtype of the resource (function)
 * @param {number} [networkObjectListIndex] - networkObjectList Index
 * @param {number} [cpu] - Number of CPUs
 * @param {string} [ram_size] - Virtual memory size
 * @param {string} [free_space_size] - Free hard drive space
 *
 * @constructor
 */
function Resource(type, id, softwareCompliant, func, networkObjectListIndex, cpu, ram_size, free_space_size) {
    /** @type {string} **/
    this.type = type;
    /** @type {string} **/
    this.function = func;
    /** @type {string} **/
    this.id = id;
    /** @type {number} **/
    this.networkObjectIndex = networkObjectListIndex;
    /** @type {boolean} **/
    this.softwareCompliant = softwareCompliant;
    /** @type {number} **/
    this.cpu = cpu;
    /** @type {string} **/
    this.ram_size = ram_size;
    /** @type {string} **/
    this.free_space_size = free_space_size;
    /** @type {Interface[]} **/
    this.network_interfaces = [];
}

// Array Remove - By John Resig (MIT Licensed)
function removeFromArray(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
}

/**
 * Delete an interface by using the index of a resource
 * @param {Resource} endpoint - Index of a Resource
 */
Resource.prototype.deleteInterfaceByEndpoint = function(endpoint) {
    for(var i = 0; i < this.network_interfaces.length; i++) {
        if (this.network_interfaces[i].endpoint.equals(endpoint)) {
            removeFromArray(this.network_interfaces, i);
        }
    }
};

/**
 *
 * @param {Resource} res -
 * @returns {boolean}
 */
Resource.prototype.equals = function(res) {
    return (this.index === res.index);
};

/**
 * Get the id (name) of the Resource
 * @returns {string}
 */
Resource.prototype.getId = function() {
    return this.id;
};

/**
 * Get the type of the Resource
 * @returns {string}
 */
Resource.prototype.getType = function() {
    return this.type;
};

/**
 * Get the index of the Resource
 * @returns {number}
 */
Resource.prototype.getNetworkObjectIndex = function() {
    return this.networkObjectIndex;
};

/**
 *
 * @param {number} x - X Position
 * @param {number} y - Y Position
 */
Resource.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    this.fixed = true;
};

/**
 * Add a new Interface to the Resource
 * @param {Interface} iface - Interface to add
 */
Resource.prototype.addInterface = function(iface) {
    if(iface === undefined) {
        throw { name: 'ArgumentError', message: 'Iface is required!' };
    }
    /** @type {boolean} **/
    var exists = false;
    for(var j = 0; j < this.network_interfaces.length; j++) {
        if(this.network_interfaces[j].equals(iface)) {
            exists = true;
        }
    }
    if(!exists) {
        this.network_interfaces.push(iface);
    }
};

/**
 *
 * @returns {Link[]}
 */
Resource.prototype.getConnectedNodes = function() {
    var links = [];
    if(this.type !== 'switch') {
        for(var j = 0; j < this.network_interfaces.length; j++) {
            /** @type {Link} **/
            var newLink = {
                'source': this,
                'target': this.network_interfaces[j].endpoint
            };
            if(newLink.target !== undefined) {
                links.push(newLink);
            } else {
                this.deleteInterfaceByEndpoint(this.network_interfaces[j].endpoint);
            }
        }
    }
    return links;
};