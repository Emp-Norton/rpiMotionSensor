const {exec} = require('child_process');
const moment = require('moment');
const fs = require('fs');
require('dotenv').config();
const config = {
    port: process.env.PORT,
    eaddress: process.env.EMAIL
};

const sendEmail = (fileString) => {
    const formatTime = () => { return moment(Date.now()).toString().split(' ').join(' ')};
    let exc = `echo -e "to: ${config.eaddress}\nsubject: MOTION DETECTED: ${formatTime()}\n"| (cat - && uuencode ./img/${fileString}.jpg ${fileString}.jpg) | ssmtp ${config.eaddress}`;
    exec(exc, (err, stdout, stderr) => {
        if (err || stderr) {
	    const errorString = `${Date.now()}\n${err}`
	    console.log(err, stderr);
	    fs.appendFile('./logs/email-logs.txt', errorString, (err) => {
	        if (err) throw err;
	        console.log('file updated');
	    })
        }
        if (stdout) console.log(stdout);
    });
};

const takePic = () => {
    let fileString = `${Date.now().toString()}`;
    let photoCommand = `raspistill -o ./img/${fileString}.jpg`;
    exec(photoCommand, (err, stdout, stderr) => {
        if (err || stderr) console.log(err, stderr);
        if (stdout) console.log(stdout);
        sendEmail(fileString);
    });
}

const writeLog = (dataString, fileString) => {
    const formatted = dataString + '\n';
    fs.appendFile(fileString, formatted, (err) => {
        err ? console.log(err) : console.log('Log updated'); // need better handling of errors during logging
    });
}

module.exports = {
    takePic: takePic,
    sendEmail: sendEmail,
    writeLog: writeLog
}
