RPI Motion Sensor

Start Motion Sensor Server on RPi with PiCam module attached. Server reads port and recipient email address from .env 
file or command line arguments [node motionsensor.js <address> <port>].


Sensor Node:
  - Start motionSensor.py with ip and port of capture node ("python3 motionSensor.py <ip> <port>")

Capture Node:
  - Start motionsensor.js server with listening port and email address for recipient ("nodemon motionsensor.js <port> <email>"), alternatively it will default the .env file.


TODO: 
 - Immediate: Write to error log
 - Servo mount for camera
 - PTZ as much as is possible
 - Web interface controls and streaming
 - Faster image encoding
 - Remote HD save 
  - Shared DropBox folder with hourly sync?
