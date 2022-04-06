import prisma from "../lib/prisma.mjs";


import csv from 'csv-parser';
import fs from 'fs';


function readCSV(fileName){
    let results = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        results = results.filter((obj) => {
            return obj.group != "";
        })
        .map((obj) => {
            const {group, id, ...rest} = obj;
            return {group, groupIndex: Number(id), ...rest}
        });
        console.log(results);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
      });
    
}

readCSV("./content/Study Messages - GIF Morning.csv");