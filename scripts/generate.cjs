const fs = require('fs');
const creationPaths = JSON.parse(fs.readFileSync("./database-config.json"));

function createPaths(paths, root) {
    for (const path in paths) {
        if (!fs.existsSync(root + "/" + path)) {
            fs.mkdirSync(root + "/" + path);
        }
        
        if (typeof paths[path] === 'object' && paths[path] instanceof Array) {
            for (const file of paths[path]) {
                if (!fs.existsSync(root + "/" + path + "/" + file)) {
                    const d = fs.openSync(root + "/" + path + "/" + file, 'w');
                    fs.closeSync(d);
                    console.log(`Created file: ${root}/${path}/${file}`);
                }
            }
        } else if (typeof paths[path] === 'object') {
            createPaths(paths[path], root + "/" + path);
        }
    }
}

createPaths(creationPaths, ".");