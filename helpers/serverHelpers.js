const {exec} = require('child_process');
const moment = require('moment');
const fs = require('fs');
require('dotenv').config();
const config = {
    port: process.env.PORT,
    eaddress: process.env.EMAIL
};

const writeLog = (dataString, fileString = './logs/email-logs.txt') => {
    const formatted = dataString + '\n';
    fs.appendFile(fileString, formatted, (err) => {
        if (err) console.log(err); // need better handling of errors during logging
    });
}

const getCurrentTime = () => moment(Date.now());

const sendEmail = (fileString) => {
    let exc = `echo -e "to: ${config.eaddress}\nsubject: MOTION DETECTED: ${getCurrentTime()}\n"| (cat - && uuencode ./img/${fileString}.jpg ${fileString}.jpg) | ssmtp ${config.eaddress}`;
    exec(exc, (err, stdout, stderr) => {
        if (err || stderr) {
	    const errorString = `${Date.now()}\n${err}`
	    writeLog(errorString);
        }
        if (stdout) writeLog(stdout);
	writeLog(`Image ${fileString} sending at ${getCurrentTime()}`);
    });
};

const takePic = () => {
    let fileString = `${Date.now().toString()}`;
    let photoCommand = `raspistill -o ./img/${fileString}.jpg`;
    exec(photoCommand, (err, stdout, stderr) => {
	writeLog(`Image ${fileString} saving @ ${getCurrentTime()}`);
        if (err || stderr) writeLog(err||stderr);
        if (stdout) writeLog(stdout);
        sendEmail(fileString);
    });
}

module.exports = {
    takePic: takePic,
    sendEmail: sendEmail,
    writeLog: writeLog
}
