const fs = require('fs');

function checkServerFiles(requiredFiles) {

    let complete = true;
    
    requiredFiles.forEach(file => {
        try {
            fs.readFileSync(file.dir, 'utf8');
        } catch(e) {
            complete = false;
        }
    });

    return complete;
}

module.exports = {
    verfiy: () => {
        let r;

        let requiredFiles = [
            {
                dir: '../config/config.json'
            }
        ];

        if(checkServerFiles(requiredFiles))
            return { v: true } 
        else
            return { v: false, e: 'Server files missing! Please download the latest version of the Anonymchat builder.' }
        
        return r;

    }
}