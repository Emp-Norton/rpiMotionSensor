from gpiozero import MotionSensor
import os
import time
import sys
import datetime

targetIp = str(sys.argv[1])
targetPort = str(sys.argv[2])
pir = MotionSensor(4)
logFile = "/logs/motion/motion-sensor-log.txt"

def writeLog(data):
    f = open(logFile, 'w')
    f.write(data)
    f.close()

def alert():
    cmd = "curl %s:%s/sendEmail" % (targetIp, targetPort)
    print(cmd)
    currentTime = time.time()
    timestamp = datetime.datetime.fromtimestamp(currentTime).strftime('%Y-%m-%d %H:%M:%S')
    writeLog("Detection @ %s\n" % timestamp)
    os.system(cmd)

def main():
    pir.when_motion = alert
    pir.wait_for_motion()


while True:
    try:
        main()
    except Exception, e: # this isn't working. sigint?
	errorString = "Error. Check log %s" % (logFile)
        print(errorString)
	writeLog("Error: \n %s \n" % errorString)
