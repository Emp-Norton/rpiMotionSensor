from gpiozero import MotionSensor
import os
import time

pir = MotionSensor(4)

def alert():
    print("sending")
    os.system('curl 10.0.0.237:3035/sendEmail')

def main():
    pir.when_motion = alert
    pir.wait_for_motion()


while True:
    main()
