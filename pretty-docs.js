const fs = require('fs');
const glob = require('glob');
const beautify = require('js-beautify').html;

let config = JSON.parse(fs.readFileSync('jsdoc.json', 'utf8'));
let files = glob.sync(`${config.opts.destination}/**.html`);

for (path of files) {
    console.log(`Beautifying doc file ${path}`);
    let contents = fs.readFileSync(path, 'utf-8');
    let prettyContents = beautify(contents, {max_preserve_newlines: 1});
    fs.writeFileSync(path, prettyContents, 'utf-8');
}
