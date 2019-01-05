
const express = require('express');
const {exec} = require('child_process');
const moment = require('moment');
const app = express();
const fs = require('fs');
const helpers = require('./helpers/serverHelpers');
// MAJOR ISSUE: the way I'm using child processes is flawed, I'm not closing them or something.
// This causes nodemon to error out (ADDRINUSE). Look at SIGINT / SIGQUIT / closing processes for fix.
require('dotenv').config();
const args = process.argv.slice(2);

const config = {
  port: parseInt(args[0]) || process.env.PORT,
  eaddress: args[1] || process.env.EMAIL,
};

app.get('/sendEmail', (req, res) => {
  helpers.writeLog(`Served request @ ${moment(Date.now())}.`, './logs/email-logs.txt');
  helpers.takePic();
  res.end('Request finished');
});

app.listen(config.port, ()=> {
  console.log(`listening on ${config.port}`);
});
