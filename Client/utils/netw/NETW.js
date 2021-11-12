const Packet = require('./Packet'), 
    Protocol = require('./Protocol');

const cryptr = require('./cryptr'),
    net = require('net');

class con {
    Socket;
    /**
     * @param {net.Socket} socket 
     */
    constructor(socket) {

        /**
         * @param {Packet} p 
         */
        const sendPacket = (p) => {
            if(!socket.writable)
                throw new Error('Socket not writable.');
            
            p.args.join(' ');
        }
    }
}