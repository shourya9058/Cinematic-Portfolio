const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'sequence');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    // Filter for png files and sort them to ensure correct order
    const pngFiles = files.filter(file => file.endsWith('.png')).sort();

    pngFiles.forEach((file, index) => {
        const oldPath = path.join(directoryPath, file);
        const newFilename = `frame_${index.toString().padStart(3, '0')}.png`;
        const newPath = path.join(directoryPath, newFilename);
        
        fs.rename(oldPath, newPath, (err) => {
            if (err) console.log('ERROR: ' + err);
            else console.log(`Renamed ${file} -> ${newFilename}`);
        });
    });
});
