process.stdin.resume();

// Get the AnonymChat API
const api = require('./utils/API');

// Create a new Client
const client = new api.Client(process.argv[2]);

// Create a new Readline interface
const rl = require('readline').createInterface(process.stdin, process.stdout);

// Create a new EventStream
const events = require('events');
const event = new events();

/**
 * Registered Events:
 *  - connected
 */

function prompt() {
    rl.question(`<${client.name}> `, message => {
        if(message) {
            client.con.write(`msg¬ ${client.id} ${message}`);
        }
        prompt(); // Loops the function that after a message was sent a new prompt appears.
    });
}

function promptForConnection() {
    console.clear();
    console.log('\n         Welcome to anonymchat!\n');
    rl.question('   Enter host: ', host=>{
        rl.question('   Enter port: ', port=>{
            client.connect(host, parseInt(port, 10));
            client.con.on('ready', ()=>{connected();auth()});
        });
    });
}

function promptForUsername() {
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


// Will be executed when it's connected
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

process.title = 'Anonymchat.';

connect();