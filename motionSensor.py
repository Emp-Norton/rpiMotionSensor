import os
import time
import sys
import datetime

from gpiozero import MotionSensor

target_ip = str(sys.argv[1])
target_port = str(sys.argv[2])
# TODO : Add this to the .env file since each controller will have its own GPIO configuration.
pir = MotionSensor(4)
log_file = "./logs/motion/motion-sensor-log.txt"
error_log_file = "./logs/motion/motion-sensor-error-log.txt"


def write_log(data, log_file_path):
    # TODO: Refactor this to use 'with open' for guaranted close()
    f = open(log_file_path, 'w')
    f.write(data)
    f.close()


def alert():
    currentTime = time.time()
    timestamp = datetime.datetime.fromtimestamp(currentTime).strftime('%Y-%m-%d %H:%M:%S')
    # TODO: refactor this and all logger calls to accept error or historical path. 
    # TODO : use built-in logger?
    write_log("Detection @ %s\n" % timestamp)
    cmd = "curl %s:%s/sendEmail" % (targetIp, targetPort)
    print(cmd)
    os.system(cmd)


def main():
    pir.when_motion = alert
    while True:
        pir.wait_for_motion()


try:
    main()
# TODO: Fix this exception for when no arguments are passed to the CLI.
except IndexError:
    print("Error: No arguments received.")
    write_log("Error: \n %s \n" % errorString)
