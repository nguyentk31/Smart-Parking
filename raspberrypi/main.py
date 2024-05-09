import random
from paho.mqtt import client
import argparse
import json
from time import sleep, strftime
import cv2
from threading import Thread
from utils.stream_main import stream, streaming_server
from utils.function import detect_lp, ocr_lp, post_data
import utils.common_vars_consts as cvc

from picamera2 import Picamera2, MappedArray
from picamera2.encoders import JpegEncoder
from picamera2.outputs import FileOutput

### GLOBALS
QUIT_SIGNAL = False
REQUEST = False

PICAM2 = Picamera2()

# Define MQTT on_message()
def mqtt_on_message(client, userdata, msg):
  global REQUEST
  m_decode = str(msg.payload.decode('utf-8', 'ignore'))
  json_recv = json.loads(m_decode)
  print(f'Received msg from {msg.topic} topic')
  if msg.topic == cvc.MQTT_SUB:
    REQUEST = bool(json_recv['status'])
    print('Parking gate status is: ', REQUEST)

# Define MQTT on_connect()
def on_connect(client, userdata, flags, rc, properties):
  if rc == 0:
    print("Connected to MQTT Broker!")
    mqtt.subscribe(cvc.MQTT_SUB)
  else:
    print("Failed to connect, return code %d\n", rc)

mqtt = client.Client(client_id=f'python-mqtt-{random.randint(0, 1000)}', callback_api_version=client.CallbackAPIVersion.VERSION2)
mqtt.username_pw_set(cvc.MQTT_USERNAME,  cvc.MQTT_PASSWORD)
try:
  mqtt.connect(cvc.MQTT_BROKER, cvc.MQTT_PORT)
except:
  print('mqtt connection timeout')
mqtt.on_connect = on_connect
mqtt.on_message = mqtt_on_message

# Write timestamp and draw focus arae
def draw_bound(request):
  timestamp = strftime("%Y-%m-%d %X")
  with MappedArray(request, "main") as m:
    cv2.putText(m.array, timestamp, (0, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    # Draw focus arae
    tmp_image = m.array.copy()
    cv2.rectangle(tmp_image, cvc.PROCESS_RECT[0:2], cvc.PROCESS_RECT[2:4], (0, 0, 255), 1)
    stream.write(cv2.imencode('.jpeg', tmp_image)[1].tobytes())

# License plate recognition
def Process_image(detection_threshold, recognition_threshold):
  global QUIT_SIGNAL, REQUEST
  detected_time = 0
  detected_plate = 'noset'
  while True:
    # If QUIT_SIGNAL set True, then end program
    if (QUIT_SIGNAL):
      print('Stop process image!')
      break
    # If REQUEST set True, then proccess image (start license plate recognition)
    elif (REQUEST):
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
        if (detected_plate != plate):
          detected_plate = plate
          detected_time = 1
        else:
          # if (detected_time < 2):
          if (detected_time < 1):
            detected_time += 1
          else:
            detected_plate = 'noset'
            detected_time = 0
            # post result to edge gateway
            data = {
              'direction': cvc.DIRECTION,
              'lp_part1': p1,
              'lp_part2': p2
            }
            post_data(image, data)
            sleep(3)
            REQUEST = False

      # if catch exception then stop processing image
      except Exception as e:
        print('error:')
        print(e)
        REQUEST = False
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

def run(detection_threshold, recognition_threshold, review):
  global mqtt, PICAM2, QUIT_SIGNAL, REQUEST
  # Start MQTT client (connect to MQTT Broker)
  try:
    mqtt.loop_start()
    print('Start Mqtt client!')
  except Exception as e:
    print(e)

  main = {'size': (640, 480), 'format': 'RGB888'}
  threads = []
  # if review flag is set, then start streaming server thread 
  if (review):
    PICAM2.pre_callback = draw_bound
    PICAM2.configure(PICAM2.create_video_configuration(main))
    PICAM2.start_recording(JpegEncoder(), FileOutput('test.h264'))
    # PICAM2.start_recording(JpegEncoder(), FileOutput(None))
    threads.append(Thread(target=Streaming, args=(streaming_server,)))
  else:
    PICAM2.configure(PICAM2.create_still_configuration(main))
    PICAM2.start()
  # Run Process image and MQTT Client in new threads
  threads.append(Thread(target=Process_image, args=(detection_threshold, recognition_threshold,)))
  
  for t in threads:
    t.start()

  # Read input
  while True:
    i = input()
    # if input is q(uit) then send QUIT_SIGNAL and stop all threads and end program
    if (i == 'q'):
      QUIT_SIGNAL = True
      mqtt.loop_stop()
      print('Stop Mqtt client!')
      break
    if (i == 's'):
      REQUEST = False

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

  run(args.detection_threshold, args.recognition_threshold, args.review)

# python main.py --detection_threshold 0.8 --recognition_threshold 0.4 -review
