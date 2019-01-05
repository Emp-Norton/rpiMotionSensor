
const express = require('express');
const moment = require('moment');
const app = express();
const helpers = require('./helpers/serverHelpers');
// MAJOR ISSUE: the way I'm using child processes is flawed, I'm not closing them correctly (or at all)..
// This causes nodemon to error out (ADDRINUSE). Look at SIGINT / SIGQUIT / closing processes for fix.

/*
TODO:
  - speed up encoding
  - save to remote HD
  - fix issue above
  - npm start command line args
  - finish cleanup / remove vestigial dependencies
  - boot on launch
  - major work on the python section
    - logging working
    - keyboard interrupt
    - ...
*/
require('dotenv').config();
const args = process.argv.slice(2);

const config = {
  port: parseInt(args[0]) || process.env.PORT,
  eaddress: args[1] || process.env.EMAIL,
};

app.get('/sendEmail', (req, res) => {
  helpers.writeLog(`Serving request @ ${moment(Date.now())}.`, './logs/email-logs.txt');
  helpers.takePic();
  res.end('Request finished');
});

app.listen(config.port, ()=> {
  console.log(`listening on ${config.port}`);
});
