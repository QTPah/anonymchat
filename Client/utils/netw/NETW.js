const Packet = require('./Packet'), 
    Protocol = require('./Protocol');

const cryptr = require('./cryptr'),
    net = require('net'),
    EventEmitter = require('events');

class con extends EventEmitter {
    Socket;
    /**
     * @param {net.Socket} socket 
     */
    constructor(socket) {

        /**
         * @param {Packet} p 
         */
        this.sendPacket = (p) => {
            if(!socket.writable)
                throw new Error('Socket not writable.');
            socket.write(`${p.prefix} ${p.content}`);
        }

        socket.on('data', buffer => {
            let data = buffer.toString('utf8');
            this.emit('packet', [data]);
        });
    }
}