var fs = require('fs')
var pino = require('pino')
var multistream = require('pino-multi-stream').multistream
var moment = require('moment');  
var path = require("path")

var today = moment().format("DD-MM-YYYY");
var hour = moment().format("hh_mm_ss")

async function createFolder() {  
   await fs.mkdir( path.resolve(__dirname, '..') + '/log/'+today, { recursive: true }, (err) => {

   })

}

createFolder()

var streams = [
  {stream: fs.createWriteStream('./log/'+today+'/all-'+hour+'.log')},
  {level: 'debug', stream: fs.createWriteStream('./log/'+today+'/debug-'+hour+'.log')},
  {level: 'error', stream: fs.createWriteStream('./log/'+today+'/error-'+hour+'.log')},
  {level: 'info', stream: fs.createWriteStream('./log/'+today+'/info-'+hour+'.log')},
  {level: 'fatal', stream: fs.createWriteStream('./log/'+today+'/fatal-'+hour+'.log')},
  {stream: process.stdout},
]

var log = pino({
   level: 'debug', // this MUST be set at the lowest level of the
   prettyPrint: { 
      colorize: false,
      translateTime: false,
      translateTime: 'dd-mm-yyyy HH:MM:ss',
   },
  
}, multistream(streams))
 




module.exports = log;