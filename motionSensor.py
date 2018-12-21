from gpiozero import MotionSensor
import os
import time
import sys

targetIp = str(sys.argv[1])
targetPort = str(sys.argv[2])
pir = MotionSensor(4)

def alert():
    cmd = "curl %s:%s/sendEmail" % (targetIp, targetPort)
    os.system(cmd)

def main():
    pir.when_motion = alert
    pir.wait_for_motion()


try:
   while True:
	main()

except KeyboardInterrupt:
    print("Quitting")
