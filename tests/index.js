var API, Extractor, config, ecb, fcb, fs, scb;

Extractor = require("../index.js");

fs = require("fs-extra");

config = fs.readJsonSync("./testconfig/config.json");

API = new Extractor(config);

console.log(config);

scb = function(data) {
  console.log("success!");
  return fs.writeJsonSync("./testoutput/new_scraped_data.json", data, {
    spaces: 2
  });
};

ecb = function(e) {
  console.log("error!");
  return console.log(e);
};

fcb = function() {
  return console.log("FINALLY...");
};

API.execute(scb, ecb, fcb);
