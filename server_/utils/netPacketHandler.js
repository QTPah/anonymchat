const net = require('net');

const PROTOCOL = require('./IProtocol');

class Packet {
    protocol;
    args;
    /**
     * 
     * @param {Protocol} protocol 
     * @param {String[]} args 
     */
    constructor(protocol, args) {
        this.protocol = protocol;
        this.args = args;
    }
}

class Protocol {
    name;
    prefix;
    /**
     * 
     * @param {String} name 
     * @param {String} prefix 
     * @param {Function} handler 
     */
    constructor(name, prefix, handler) {
        this.prefix = prefix;
        function handle(con, packet) { handler(con, packet) };
        this.handle = handle;
        this.name = name;
    }
}

/**
 * 
 * @param {net.Socket} con 
 * @param {Packet} packet 
 */
function sendPacket(con, packet) {
    con.write(`${packet.protocol.prefix} ${packet.args.join(' ')}`);
    console.log(`sent to ${con.localAddress}: ${packet.protocol.prefix} ${packet.args.join(' ')}`);
}

/**
 * 
 * @param {net.Socket} con 
 * @param {Packet} packet 
 * @param {Protocol} protocol
 */
function handlePacket(con, packet) {
    console.log(`revieved from ${con.localAddress}: ${packet.protocol.prefix} ${packet.args.join(' ')}`);
    packet.protocol.handle(con, packet);
}

module.exports = {
    Protocol,
    Packet,
    handlePacket,
    sendPacket
}