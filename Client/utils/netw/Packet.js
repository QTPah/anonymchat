class Packet {
    prefix;
    content;
    /**
     * @param {String} prefix 
     * @param {String} content 
     */
    constructor(prefix, content) {
        this.content = content;
        this.prefix = prefix;
    }
}

module.exports = Packet;