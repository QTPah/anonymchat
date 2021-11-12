const Protocol = require('./Protocol');

class Packet {
    protocol
    args
    /**
     * 
     * @param {Protocol} protocol 
     * @param {Array} args 
     */
    constructor(protocol, args) {
        this.protocol = protocol; this.args = args;
    }
}

module.exports = Packet;