Extractor = require "../index.js"
fs = require("fs-extra")

config = fs.readJsonSync "./testconfig/config.json"



API = new Extractor(config)

console.log config

scb = (data)->
  console.log "success!"
  fs.writeJsonSync "./testoutput/new_scraped_data.json", data, { spaces: 2 }

ecb = (e)->
  console.log "error!"
  console.log e
fcb = ()->
  console.log "FINALLY..."

API.execute  scb, ecb, fcb
