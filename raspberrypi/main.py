import argparse
from time import sleep
import cv2
from threading import Thread
from utils.stream_main import stream, streaming_server
from utils.mqtt_client import MQTT_Client
from utils.funtions import detect_lp, ocr_lp
import utils.common_vars_consts as cvc

from picamera2 import Picamera2, MappedArray
from picamera2.encoders import JpegEncoder
from picamera2.outputs import FileOutput

# Draw focus arae
def draw_bound(request):
  with MappedArray(request, "main") as m:
    cv2.rectangle(m.array, cvc.PROCESS_RECT[0:2], cvc.PROCESS_RECT[2:4], (0, 0, 255), 1)

# License plate recognition
def Process_image(detection_threshold, recognition_threshold):
  while True:
    # If QUIT_SIGNAL set True, then end program
    if (cvc.QUIT_SIGNAL):
      print('Stop process image!')
      break
    # If REQUEST set True, then proccess image (start license plate recognition)
    elif (cvc.REQUEST):
      try:
        # Capture image
        image = PICAM2.capture_array()
        print('capture done.')

        # Detect license plate in image
        detection_result = detect_lp(image, detection_threshold)
        if (detection_result is None):
          print('License plate not found.')
          continue
        plate_image, score = detection_result
        print(f'Found license plate with {score} score.')

        # Ocr detected license plate
        ocr_result = ocr_lp(plate_image, recognition_threshold)
        if (ocr_result is None):
          print('licence plate invalid!')
          continue
        p1, p2 = ocr_result
        print(f'OCR: part 1: {p1}, part 2: {p2}')

        # If OCR the same license plate 3 times, then stop recognition and sent result to MQTT broker
        plate = p1+p2
        if (cvc.DETECTED['plate'] == ''):
          cvc.DETECTED['plate'] = plate
          cvc.DETECTED['time'] += 1
        elif (cvc.DETECTED['plate'] == plate):
          if (cvc.DETECTED['time'] == 2):
            cvc.DETECTED['plate'] = ''
            cvc.DETECTED['time'] = 0
            # Sent result to MQTT Broker
            data = {'part1': p1, 'part2': p2}
            MQTT_CLIENT.publish('recognize done.', data)
            cvc.REQUEST = False
          else:
            cvc.DETECTED['time'] += 1
        # if OCR new license plate then assign plate and set time to 0
        else:
          cvc.DETECTED['plate'] = plate
          cvc.DETECTED['time'] = 1
      # if catch exception then stop processing image
      except Exception as e:
        print(e)
        cv2.REQUEST = False
    else:
      sleep(1)

# Stream preview camera
def Streaming(streaming_server):
  try:
    print('Start streaming!')
    streaming_server.serve_forever()
    print('Stop streaming!')
  except Exception as e:
    print(e)

# Start MQTT client (connect to MQTT Broker)
def MQTT_Start(mqtt_client):
  try:
    MQTT_CLIENT.start()
    print('Stop Mqtt client!')
  except Exception as e:
    print(e)


def run(detection_threshold, recognition_threshold, review):
  main = {'size': (640, 480), 'format': 'RGB888'}
  threads = []
  # if review flag is set, then start streaming server thread 
  if (review):
    PICAM2.pre_callback = draw_bound
    PICAM2.configure(PICAM2.create_video_configuration(main))
    PICAM2.start_recording(JpegEncoder(), FileOutput(stream))
    threads.append(Thread(target=Streaming, args=(streaming_server,)))
  else:
    PICAM2.configure(PICAM2.create_still_configuration(main))
    PICAM2.start()
  # Run Process image and MQTT Client in new threads
  threads.append(Thread(target=Process_image, args=(detection_threshold, recognition_threshold,)))
  threads.append(Thread(target=MQTT_Start, args=()))
  
  for t in threads:
    t.start()

  # Read input
  while True:
    i = input()
    # if input is q(uit) then send QUIT_SIGNAL and stop all threads and end program
    if (i == 'q'):
      cvc.QUIT_SIGNAL = True
      MQTT_CLIENT.stop()
      break

  if (review):
    streaming_server.shutdown()
    PICAM2.stop_recording()
  else:
    PICAM2.stop()

  for t in threads:
    t.join()

if __name__ == '__main__':
  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument(
    '--detection_threshold',
    help='Threshold of detection score.',
    type=float,
    required=True
  )
  parser.add_argument(
    '--recognition_threshold',
    help='Threshold of recognition score.',
    type=float,
    required=True
  )
  parser.add_argument(
    '-review',
    help='Streaming review.',
    action='store_true'
  )
  args = parser.parse_args()

  PICAM2 = Picamera2()
  MQTT_CLIENT = MQTT_Client(cvc.MQTT_INFO['broker'],
                            cvc.MQTT_INFO['port'],
                            cvc.MQTT_INFO['publish_topic'],
                            cvc.MQTT_INFO['subcribe_topic'],
                            cvc.MQTT_INFO['client_id'],
                            cvc.MQTT_INFO['username'],
                            cvc.MQTT_INFO['password'])

  run(args.detection_threshold, args.recognition_threshold, args.review)

# python main.py --detection_threshold 0.8 --recognition_threshold 0.3 -review
