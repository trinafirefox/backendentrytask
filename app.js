const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const Papa = require("papaparse");

//parsing csv file into json
const csvFilePath = "history/Backend Entry Task Data - Sheet1.csv";

const file = fs.createReadStream(csvFilePath);

var csvData = [];
Papa.parse(file, {
  header: true,
  step: function (result) {
    csvData.push(result.data);
  },
  complete: function (results, file) {
    console.log("Complete", csvData.length, "records.");
    console.log(csvData);
    for (let index = 0; index < csvData.length; index++) {
      let uri = "";
      if (csvData[index].pathname === "*") {
        uri += "/*";
      } else {
        uri += csvData[index].pathname;
      }
    
      if (csvData[index].search === "*") {
        uri += "/*";
      } else {
        uri += csvData[index].search;
      }
    
      if (csvData[index].hash === "*") {
        uri += "/*";
      } else {
        uri += csvData[index].hash;
      }
      console.log(uri);
      app.get(uri, (req, res) => {
        res.send(csvData[index].response);
      });
    }
    
  },
});

//middleware
app.use(cors());
app.use(express.json());

console.log(csvData);

app.listen(3000, () => {
  console.log("server has started on port 3000!");
});
