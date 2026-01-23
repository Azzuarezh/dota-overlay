import { readdir, rename } from 'fs';
import {join} from 'path';


const prefix = 'npc_dota_hero_';
const folderPath = './static/assets/hero_popup_video/webm'; // Replace with your folder's path


readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Iterate through each file
        files.forEach(file => {
            const oldFilePath = join(folderPath, file);

            // Construct the new file name with the removed prefix
            const newFileName = file.substring(prefix.length);
            const newFilePath = join(folderPath, newFileName);

            // Rename the file
            rename(oldFilePath, newFilePath, err => {
                if (err) {
                    console.error(`Error renaming file ${file}:`, err);
                } else {
                    console.log(`Renamed "${file}" to "${newFileName}"`);
                }
            });
        });
    });