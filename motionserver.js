
const express = require('express');
const {exec} = require('child_process');
const moment = require('moment');
const app = express();
const fs = require('fs');
const helpers = require('./helpers/serverHelpers');

// Decide which direction to go with this: env variables, command line arguments, or both (messy?)
// passing arguments when using npm start? Config file?
require('dotenv').config();
const args = process.argv.slice(2);

const config = {
  port: parseInt(args[0]) || process.env.PORT,
  eaddress: args[1] || process.env.EMAIL,
};

app.get('/sendEmail', (req, res) => {


  const eventString = `Request received at ${moment(Date.now())}:\n`;
  fs.appendFile('./logs/email-logs.txt', eventString, (err) => {
    if (err) console.log(err) // there should be a high order error logging function for all of this
    console.log('Request logged');
  })

  helpers.takePic();
  res.end();
});

app.listen(config.port, ()=> {
  console.log(`listening on ${config.port}`);
})


