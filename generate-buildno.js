import { readFile, writeFile } from 'fs/promises';

const metadataLocation = 'src/utils/metadata.json';

const incrementBuildNumber = async () => {
    try {
        console.log('Incrementing build number...');
        
        const content = await readFile(metadataLocation, 'utf8');
        const metadata = JSON.parse(content);
        
        metadata.buildRevision += 1;
        
        await writeFile(metadataLocation, JSON.stringify(metadata, null, 2));
        
        console.log(`Current build number: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`);
    } catch (err) {
        console.error('Error updating build number:', err);
        process.exit(1);
    }
};

incrementBuildNumber();