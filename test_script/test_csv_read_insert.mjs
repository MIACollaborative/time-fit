import prisma from "../lib/prisma.mjs";

import csv from "csv-parser";
import fs from "fs";
import path from "path";

async function insertMessages(results) {
  // now insert into db using prisma

  const messages = await prisma.message.createMany({
    data: results,
    //skipDuplicates: true, // Skip 'Bobo'
  });

  return messages;
}

function readCSVAndInsert(fileName) {
  let results = [];
  fs.createReadStream(fileName)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results = results
        .filter((obj) => {
          return obj.group != "";
        })
        .map((obj) => {
          const { group, id, ...rest } = obj;
          let label = `${group}_${id}`;
          return { label, group, groupIndex: Number(id), ...rest };
        });
      console.log(results);
      insertMessages(results);
    });
}

function readAndInsertMessage() {
  //joining path of directory
  const directoryPath = path.join("./", "content");
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      let fileName = `./content/${file}`;
      console.log();
      readCSVAndInsert(fileName, "message");
    });
  });
}

readAndInsertMessage();

//readCSV("./content/Study Messages - GIF Morning.csv");
//readCSV("./content/Study Messages - GIF Afternoon.csv");
//readCSV("./content/Study Messages - Non-GIF Morning.csv");
//readCSV("./content/Study Messages - Non-GIF Afternoon.csv");
//readCSV("./content/Study Messages - Morning Salience (Editing).csv");
//readCSV("./content/Study Messages - Notifications (Editing).csv");
