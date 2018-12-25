const express = require('express');
const {exec} = require('child_process');
const moment = require('moment');
const app = express();
const fs = require('fs');


// Decide which direction to go with this: env variables, command line arguments, or both (messy?)
// passing arguments when using npm start? Config file?
require('dotenv').config();
const args = process.argv.slice(2);

const config = {
  port: parseInt(args[0]) || process.env.PORT,
  eaddress: args[1] || process.env.EMAIL,
};

app.get('/sendEmail', (req, res) => {
  const requestStart = Date.now();
  const formatTime = () => { return moment(Date.now()).toString().split(' ').slice(0, 4).join(' ')};

/*
For some reason, this breaks when the time string is included. #slice(0,4) and (5, ...) work, but
renders empty string if [4] is included. It also breaks when using the momentjs #format() method.
In the meantime, the time the email was received will have to suffice.
*/

  const sendEmail = (fileString) => {
    let exc = `echo -e "to: ${config.eaddress}\nsubject: MOTION DETECTED: ${formatTime()}\n"| (cat - && uuencode ./img/${fileString}.jpg ${fileString}.jpg) | ssmtp ${config.eaddress}`;
    // is there really a good reason to keep the console logs here, given that the devices are headless? Methinks not.
    console.log(`Sending email: \n ${exc}`);
    exec(exc, (err, stdout, stderr) => {
      if (err || stderr) {
	// need very specific time stamps for error codes, ergo using unix time instead of subpar formatTime func. Refac func or explore Moment for solution.
	const errorString = `${Date.now()}\n${err}`
	console.log(err, stderr);
	// need check for existence of logs directory / permissions to create it. Look at existing log directories as storage areas.
	fs.appendFile('./logs/email-logs.txt', errorString, (err) => {
	  if (err) throw err;
	  console.log('file updated');
	})
      }
      if (stdout) console.log(stdout);
	// need to improve the speed, but the benchmark can be dropped for now
      const duration = (Date.now() - requestStart) / 1000;
      console.log(`Total time spent: ${duration} seconds`);
    });
  }
  const takePic = () => {
    let fileString = `${Date.now().toString()}`;
    let photoCommand = `raspistill -o ./img/${fileString}.jpg`;
    exec(photoCommand, (err, stdout, stderr) => {
      if (err || stderr) console.log(err, stderr);
      if (stdout) console.log(stdout);
      console.log(`Photo succeeded after: ${(Date.now() - requestStart) / 1000} seconds`);
      sendEmail(fileString);
    });
  }


  takePic();
  res.end();
});

app.listen(config.port, ()=> {
  console.log(`listening on ${config.port}`);
})


