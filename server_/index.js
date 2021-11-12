const net = require('net');

const api = require('./utils/API');

const fs = require('fs');

const nph = require('./utils/netPacketHandler');

let server = new api.Server();

let users = [];

/**
 * 
 * @param {api.Client} user 
 */
function sendMessage(user, message) {
    user.con.write(`msg¬ Anonymchat ${message}`);
}

let PMessage = new nph.Protocol('msg', 'msg¬', 
/**
 * 
 * @param {net.Socket} con 
 * @param {nph.Packet} packet 
 */
(con, packet) => {
    let args = packet.args;

    let sender = users.filter(user => user.id == args[0])[0];

    if(sender){
        users.forEach(async user=>{  
            if(sender.id != user.id){
                await nph.sendPacket(user.con, new nph.Packet(PMessage, `${sender.name} ${args.slice(1, args.length).join(' ')}`.split(' ')));
            }
        });
    } else {
        con.write('msg¬ Anonymchat Bad login! Cutting connection.');
        con.destroy();
    }

});

let PAuth = new nph.Protocol('auth1', 'auth1¬',
/**
* 
* @param {net.Socket} con 
* @param {nph.Packet} packet 
*/
(con, packet) => {

    for(i=0; i<users.length; i++){
        if(users[i].name == packet.args[0]) {
            con.write('authError1¬ Username Taken!');
            return;
        }
        let id = `${new Date().getTime()}${Math.floor(Math.random()*999+100)}`.toString(16);
        let newClient = new api.Client(packet.args[0]);
        newClient.id = id; newClient.con = con;
        users.push(newClient);
        nph.sendPacket(con, new nph.Packet(PAuth, [id]));
        users.forEach(user=>{
            sendMessage(user, newClient.name+' joined!')
        });
        break;
    }
    if(users.length == 0) {
        let id = `${new Date().getTime()}${Math.floor(Math.random()*999+100)}`.toString(16);
        let newClient = new api.Client(packet.args[0]);
        newClient.id = id; newClient.con = con;
        users.push(newClient);
        nph.sendPacket(con, new nph.Packet(PAuth, [id]));
        users.forEach(user=>{
            sendMessage(user, newClient.name+' joined!')
        });
    }

});

let protocols = [PMessage, PAuth];



server.handleClient(
    /**
     * 
     * @param {net.Socket} client 
     */
    (client)=>{

    client.on('close', ()=>{
        let kill;
        let name;
        for(i in users) {
            if(users[i].con == client) {
                kill = i;
                name = users[i].name;                
            }
        }
        users.splice(kill, 1);
        users.forEach(user=>sendMessage(user, name+' has left.'))
    });

    client.on('data', buffer => {
        let data = buffer.toString('utf8');

        console.log('recieved: '+data);

        let args = data.split(' ');

        protocols.forEach(protocol => {
            if(args[0].startsWith(protocol.prefix)) {
                let packet = new nph.Packet(PMessage, data.split(' ').slice(1, data.length));
                protocol.handle(client, packet)
            }
        });
    });
});

if(require('./modules/verifyer').verfiy().v) {
    let config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
    const PORT = config.port;

    server.listen(PORT, ()=>console.log(`Anonymchat server runs on 127.0.0.1:${PORT}`));
} else {
    console.log(require('./modules/verifyer').verfiy().e);
}



