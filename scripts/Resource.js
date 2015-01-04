'use strict';

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
 * @param {number} [index] -
 * @param {number} [cpu] - Number of CPUs
 * @param {string} [ram_size] - Virtual memory size
 * @param {string} [free_space_size] - Free hard drive space
 * @param {Interface[]} [iface] - List of network interfaces
 *
 * @constructor
 */
function Resource(type, id, softwareCompliant, func, index, cpu, ram_size, free_space_size, iface) {
    /** @type {string} **/
    this.type = type;
    /** @type {string} **/
    this.function = func;
    /** @type {string} **/
    this.id = id;
    /** @type {number} **/
    this.networkObjectIndex = index;
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
    if(iface !== undefined && iface.hasOwnProperty('length')) {
        for(var i = 0; i < iface.length; i++) {
            var e = iface[i].ipv4_configuration;
            this.network_interfaces.push(new Interface(iface[i].endpoint, e.dhcp, e.ip, e.network, e.netmask, e.gateway));
        }
    }
}

// Array Remove - By John Resig (MIT Licensed)
function removeFromArray(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
}

Resource.prototype.deleteInterfaceByEndpoint = function(endpoint) {
    console.log('test');
    for(var i = 0; i < this.network_interfaces.length; i++) {
        if (this.network_interfaces[i].endpoint === endpoint) {
            removeFromArray(this.network_interfaces, i);
        }
    }
};

Resource.prototype.getId = function() {
    return this.id;
};

Resource.prototype.getType = function() {
    return this.type;
};

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
 *
 * @param {Interface} iface -
 */
Resource.prototype.addInterface = function(iface) {
    // TODO check if interface (endpoint) already exists
    if(iface === undefined) {
        throw { name: 'ArgumentError', message: 'Iface is required!' };
    }
    this.network_interfaces.push(iface);
};

Resource.prototype.getConnectedNodes = function(sup, index) {
    var links = [];
    if(this.type !== 'switch') {
        for(var j = 0; j < this.network_interfaces.length; j++) {
            var newLink = {
                'source': this,
                'target': sup.getResourceById(this.network_interfaces[j].endpoint)
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