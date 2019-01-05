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


module.exports = {
  takePic: takePic,
  sendEmail: sendEmail,
}
