'use strict';

/**
 @typedef {Object} IPv4Configuration
 @property {boolean} dhcp - DHCP
 @property {string} ip - IP Address (optional)
 @property {string} network - Network (optional)
 @property {string} netmask - Netmask (optional)
 @property {string} gateway - Gateway (optional)
 */

/**
 * @property {Resource} endpoint - Unique resource identifier of the connected node
 * @property {IPv4Configuration} ipv4_configuration - IPv4 Configuration
 *
 * @param {Resource} endpoint -
 * @param {boolean} dhcp - Enable dhcp
 * @param {String} [ip] -
 * @param {String} [network] -
 * @param {String} [netmask] -
 * @param {string} [gateway] -
 *
 * @constructor
 */
function Interface(endpoint, dhcp, ip, network, netmask, gateway) {
    /** @type {Resource} **/
    this.endpoint = endpoint;
    /** @type {boolean} **/
    this.dhcp = dhcp;
    /** @type {string} **/
    this.ip = ip;
    /** @type {string} **/
    this.network = network;
    /** @type {string} **/
    this.netmask = netmask;
    /** @type {string} **/
    this.gateway = gateway;
}