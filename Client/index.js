process.stdin.resume(); // This will keep the Terminal Window open.

const API = require('./utils/API'),
    rl = require('readline').createInterface(process.stdin, process.stdout),
    netw = require('./utils/netw/NETW');

