'use strict';

/**
 *
 * @param {string} type -
 * @param {string} id - Unique Id
 * @param {string} [func] -
 * @param {number} [index] -
 * @param {number} [cpu] - Number of processors
 * @param {string} [ram_size] - Amount of virtual memory
 * @param {string} [free_space_size] - Free disk space
 * @param {Array} [iface] - Array of Network Interfaces
 */
function Resource(type, id, func, index, cpu, ram_size, free_space_size, iface) {
    if(type === undefined || id === undefined) {
        throw { name: 'ArgumentError', message: 'Type and id are required!' };
    }
    this.type = type;
    this.function = func;
    this.id = id;
    this.networkObjectIndex = index;
    this.cpu = cpu;
    this.ram_size = ram_size;
    this.free_space_size = free_space_size;
    this.network_interfaces = [];
    if(iface !== undefined && iface.hasOwnProperty('length')) {
        for(var i = 0; i < iface.length; i++) {
            var e = iface[i].ipv4_configuration;
            this.network_interfaces.push(new Interface(iface[i].endpoint, e.dhcp, e.ip, e.network, e.netmask, e.gateway));
        }
    }
}

Resource.prototype.getInterfaces = function() {
    return this.network_interfaces;
};

// Array Remove - By John Resig (MIT Licensed)
function removeFromArray(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
}

Resource.prototype.deleteInterfaceByEndpoint = function(endpoint) {
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
    // TODO Remove x and y when converting to json
    this.x = x;
    this.y = y;
    this.fixed = true;
};

/**
 *
 * @param {Interface} iface -
 */
Resource.prototype.addInterface = function(iface) {
    // TODO Only allow for switch to other node
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