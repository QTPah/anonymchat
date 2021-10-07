process.stdin.resume();

const api = require('./api');

const client = new api.Client(process.argv[2]);

const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

function prompt() {
    rl.question(`<${client.name}> `, (preMessage) => {
        if(preMessage) {
            client.con.write(`msg¬ ${client.id} ${preMessage}`);
        }
        prompt();
    });
}

function connect() {
    console.clear();
    console.log('\n         Welcome to anonymchat!\n');
    rl.question('   Enter host: ', host=>{
        rl.question('   Enter port: ', port=>{
            client.connect(host, parseInt(port, 10));
            client.con.on('ready', ()=>{connected();auth()});
        });
    });
}

function auth() {
    console.clear();
    console.log('\n     Welcome to da chat!!\n');
    rl.question('       Enter your username: ', (answer)=>{
        client.name = answer;
    
        client.con.write(`auth1¬ ${client.name}`);
    
        console.clear();
    });
}


/*
 * "msg¬" PROTOCOL:
 * (protocol) (user id) (message)...
 * example:
 * msg¬ 45982735793845 hello world!
 * 
 * "auth>1¬ ":
 * (protocol) (suggested user name) 
 * 
 * "auth<1¬":
 * (protocol) (user id)
 * 
 */

function connected() {
    client.con.on('data', (buffer) => {
        let data = buffer.toString('utf8');
        let args = data.split(' ');
    
        if(data.startsWith('msg¬')){
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            if(data.split(' ')[0] != client.name) console.log(`<${data.split(' ')[1]}> ${data.split(' ').slice(2, data.split(' ').length).join(' ')}`);
            process.stdout.write(`<${client.name}> `);
        } else if(data.startsWith('auth1¬')) {
            client.id = args[1];
            prompt();
        } else if(data.startsWith('authError1¬')) {
            console.log(args.slice(1, args.length).join(' '));
            rl.question('', ()=>{
                auth();
            })
        }
    });

    client.con.on('close', (hadError) => {
        console.clear();
        if(hadError) {
            console.log('\n An error ocurred :/');
            rl.question('', ()=>{
                connect();
            });
        }
    });
}



function onExit() {
    if(client.con) {
        client.con.destroy();
    }
}

//do something when app is closing
process.on('exit', onExit);
process.on('SIGQUIT', onExit)

//catches ctrl+c event
process.on('SIGINT', onExit);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', onExit);
process.on('SIGUSR2', onExit);

 
//catches uncaught exceptions
process.on('uncaughtException', onExit);

process.title = 'Anonymchat.';

connect();