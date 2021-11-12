const Packet = require('../Packet');
const cryptr = require('../cryptr');

class MessagePacket extends Packet {
    message; id;
    constructor(message, id){
        let content = `${id} ${message}`;
        super('msg', new cryptr(id).encrypt(content));
    }
}