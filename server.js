const net = require('net');

const api = require('./api');

let server = new api.Server();

let users = [];

server.handleClient(
    /**
     * 
     * @param {net.Socket} client 
     */
    (client)=>{

        /**
         * 
         * @param {api.Client} user 
         */
        function sendMessage(user, message) {
            user.con.write(`msg¬ Anonymchat ${message}`);
        }

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

        if(data.startsWith('auth>1¬')) {
            for(i=0; i<users.length; i++){
                if(users[i].name == args[1]) {
                    client.write('auth<e¬ Username Taken!'); console.log(`sent: auth<e¬ Username Taken!`);
                    return;
                }
                let id = `${new Date().getTime()}${Math.floor(Math.random()*999+100)}`.toString(16);
                let newClient = new api.Client(args[1]);
                newClient.id = id; newClient.con = client;
                users.push(newClient)
                client.write('auth<2¬ '+id);  console.log(`sent: `+'auth<2¬ '+id);
                users.forEach(user=>{
                    sendMessage(user, newClient.name+' joined!')
                });
                break;
            }
            if(users.length == 0) {
                let id = `${new Date().getTime()}${Math.floor(Math.random()*999+100)}`.toString(16);
                let newClient = new api.Client(args[1]);
                newClient.id = id; newClient.con = client;
                users.push(newClient)
                client.write('auth<2¬ '+id); console.log('2sent: '+'auth<2¬ '+id);
                users.forEach(user=>{
                    sendMessage(user, newClient.name+' joined!')
                });
            }
        } else if(data.startsWith('msg¬')){
            let sender = users.filter(user => user.id == args[1])[0];

            console.log(users.map(user => `${user.name}, ${user.id}`));
            users.forEach(async user=>{  
                if(sender.id != user.id){
                    user.con.write(`msg¬ ${sender.name} ${args.slice(2, args.length).join(' ')}`); console.log('sent: '+`msg¬ ${sender.name} ${args.slice(2, args.length).join(' ')}`)
                }      
            });
        }
    });
});

server.listen(1213, ()=>console.log('Listening!'));