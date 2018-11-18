const express = require('express');
const {exec} = require('child_process');
const moment = require('moment');
const app = express();

app.get('/sendEmail', (req, res) => {
  const requestStart = Date.now();
  const formatTime = () => { return moment(Date.now()).toString().split(' ').slice(0, 4).join(' ')};
/*
For some reason, this breaks when the time string is included. #slice(0,4) and (5, ...) work, but
renders empty string if [4] is included. It also breaks when using the momentjs #format() method.
In the meantime, the time the email was received will have to suffice.
*/
  //let command = `echo "${formatTime()}" | ssmtp -F "Motion Detected" jamesjelenko@gmail.com`;

  const sendEmail = (fileString) => {
    let exc = `echo -e "to: jamesjelenko@gmail.com\nsubject: MOTION DETECTED: ${formatTime()}\n"| (cat - && uuencode ./img/${fileString}.jpg ${fileString}.jpg) | ssmtp jamesjelenko@gmail.com`;
    console.log(`Sending email: \n ${exc}`);
    exec(exc, (err, stdout, stderr) => {
      if (err || stderr) console.log(err, stderr);
      if (stdout) console.log(stdout);
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


/*
  exec(command, (err, stdout, stderr) => {
    if (err || stderr) {
      console.log(err, stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  })
*/
  takePic();
  res.end();
});

app.listen(3030, ()=> {
  console.log('listening on 3030');
})
