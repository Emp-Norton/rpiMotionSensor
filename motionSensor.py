from gpiozero import MotionSensor
import os
import time
import sys


targetIp = str(sys.argv[1])
targetPort = str(sys.argv[2])
pir = MotionSensor(4)
logFile = "/logs/motion/motion-sensor-log.txt"

def alert():
    cmd = "curl %s:%s/sendEmail" % (targetIp, targetPort)
    print(cmd)
    os.system(cmd)

def main():
    pir.when_motion = alert
    pir.wait_for_motion()


while True:
    try:
        main()
    except Exception, e:
	errorString = "Error. Check log %s" % (logFile)
        print(errorString)
	f = open(logFile, 'w')
	f.write(e)
	f.close()
