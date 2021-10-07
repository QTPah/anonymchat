const fs = require('fs');

function ul(text) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text);
}

let dirs = [
    {
        name: 'plugins',
        subs:[]
    },
    {
        name: 'crashes',
        subs: []
    },
    {
        name: 'config',
        subs: []
    }
];

function buildDirs(){
    dirs.forEach(dir =>{
        try {
            fs.mkdirSync(dir.name);
        } catch(err) {}
    });
}

let files = [
    {
        cd: './files/start.exe',
        md: './start.exe'
    },
    {
        cd: './files/config.json',
        md: './config/config.json'
    }
]


function moveFiles() {
    files.forEach(file => {
        fs.writeFileSync(file.md, fs.readFileSync(file.cd));
    });
}

async function cleanup() {
    fs.rmdirSync('./files', { recursive: true });
}

function build() {
    console.log('Build started.');
    process.stdout.write('Building: Directories');
    buildDirs();
    ul('Building: Moving files');
    moveFiles();
    ul('Finnishing: cleaning up')
    cleanup();
    
}

build();