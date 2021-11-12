const { EventEmitter } = require('stream');

class Client extends EventEmitter {
    name;
    id;
    constructor(name) {
        super();

        const net = require('net');
        
        this.name = name;

        let client;
        this.connect = (address, port, key) => {
            client = net.connect({
                port: port,
                host: address
            });;
            this.con = client;
            return client;
        }
    }
}

class Server extends EventEmitter {

    constructor(options) {
        super();

        const net = require('net');

        let server;


        /**
         * 
         * @param {Number} port 
         * @param {Function} callback 
         */
        this.listen = (port, callback) => {
            server = net.createServer(handleClient)
            try {
                server.listen(port || 12135, null, callback);
            } catch(err) {};
            server.on('error', ()=>{})
        }

        /**
         * 
         * @param {Function} func 
         */
        this.handleClient = (func) => {
            handleClient = func;
        }

        /**
         * 
         * @param {net.Socket} client 
         */
        function handleClient(client) {
            
        }

    }

}


module.exports = { Client, Server }