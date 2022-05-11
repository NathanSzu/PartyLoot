var fs = require('fs');

const metadataLocation = 'src/utils/metadata.json';

console.log('Incrementing build number...');
fs.readFile(metadataLocation,function(err,content) {
    if (err) throw err;
    var metadata = JSON.parse(content);
    metadata.buildRevision += 1;
    fs.writeFile(metadataLocation,JSON.stringify(metadata),function(err){
        if (err) throw err;
        console.log(`Current build number: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`);
    })
});