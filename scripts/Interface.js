/**
 *
 * @param {String} endpoint -
 * @param {boolean} dhcp - Enable dhcp
 * @param {String} [ip] -
 * @param {String} [network] -
 * @param {String} [netmask] -
 * @param {String} [gateway] -
 * @constructor
 */
function Interface(endpoint, dhcp, ip, network, netmask, gateway) {
    this.endpoint = endpoint;
    this.dhcp = dhcp;
    this.ip = ip;
    this.network = network;
    this.netmask = netmask;
    this.gateway = gateway;
}