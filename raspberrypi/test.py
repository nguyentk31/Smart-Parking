import argparse
from time import sleep
import numpy as np
import cv2
from threading import Thread
from utils.stream_test import stream1, stream2, stream3, streaming_server
from utils.lp_recognition import LP_Detection, LP_Ocr
import utils.common_vars_consts as cvc

from picamera2 import Picamera2, MappedArray
from picamera2.encoders import JpegEncoder
from picamera2.outputs import FileOutput

# Draw focus arae
def draw_bound(request):
  with MappedArray(request, "main") as m:
    cv2.rectangle(m.array, cvc.PROCESS_RECT[0:2], cvc.PROCESS_RECT[2:4], (0, 0, 255), 1)

def Process_image(detection_threshold, recognition_threshold):
  while True:
    if (cvc.QUIT_SIGNAL):
      print('Stop process image!')
      break
    elif (cvc.REQUEST):
      try:
        image = PICAM2.capture_array()
        print('capture done')
        process_image = image[cvc.PROCESS_RECT[1]: cvc.PROCESS_RECT[3],cvc.PROCESS_RECT[0]:cvc.PROCESS_RECT[2]]
        result = LP_DETECTION.detect(process_image, detection_threshold)
        
        if result is None:
          print('plate not found!')
          continue

        bbox, score = result
        if (bbox[0] <= 0):
          bbox[0] = 0-bbox[2]
        elif (bbox[1] <= 0):
          bbox[1] = 0-bbox[3]
        elif (bbox[2] > cvc.FOCUS_SIZE[0]):
          bbox[2] = cvc.FOCUS_SIZE[0] + (cvc.FOCUS_SIZE[0]-bbox[0])
        elif (bbox[3] > cvc.FOCUS_SIZE[1]):
          bbox[3] = cvc.FOCUS_SIZE[1] + (cvc.FOCUS_SIZE[1]-bbox[1])

        (xmin, ymin, xmax, ymax) = bbox + np.tile(cvc.PROCESS_ORG_COOR, 2)
        ctx = (xmin + xmax) // 2 
        cty = (ymin + ymax) // 2
        d = max((xmax-xmin)//2, (ymax-ymin)//2)
        xmin, xmax, ymin, ymax = ctx - d, ctx + d, cty - d, cty + d
        try:
          plate_img = cv2.resize(image[ymin:ymax, xmin:xmax], cvc.FOCUS_SIZE)
        except Exception as e:
          print(e)
          print('plate image coordinates invalid!')
          continue
        
        scores, bboxes, characters = LP_OCR.Ocr(plate_img, recognition_threshold)

        cv2.putText(plate_img, str(score), (0, cvc.FOCUS_SIZE[1]), cv2.FONT_HERSHEY_COMPLEX, 1.5, (0,0,255), 2)
        # Write license plate to stream2
        stream2.write(cv2.imencode('.jpeg', plate_img)[1].tobytes())
        print('stream2 written')

        if (len(characters) < 7):
          print('bien so xe khong hop le')
          print(characters)
          continue

        for index, (ymin, xmin, ymax, xmax) in enumerate(bboxes):
          cv2.rectangle(plate_img, (xmin, ymin), (xmax, ymax), (255, 0, 0), 2)
          cv2.putText(plate_img, str(scores[index]), (xmin, ymin), cv2.FONT_HERSHEY_COMPLEX, 0.6, (0,0,255), 2)
          cv2.putText(plate_img, characters[index], (xmin, ymax), cv2.FONT_HERSHEY_COMPLEX, 1.6, (255,0,255), 2)
        # Write OCR result to stream3
        stream3.write(cv2.imencode('.jpeg', plate_img)[1].tobytes())
        print('stream3 written')

        xmins = bboxes[:, 1]
        idx = np.argsort(xmins)

        ymins = bboxes[:, 0]
        ymaxs = bboxes[:, 2]
        characters_heights_min = np.min(ymaxs-ymins)
        ymin_min = np.min(ymins)
        ymin_max = np.max(ymins)
        if (ymin_max - ymin_min < characters_heights_min):
            line = characters[idx]
            p1 = ''.join(line[0:4])
            p2 = ''.join(line[4:])
        else:
          p1 = p2 = np.empty((0), str)
          ymin_avr = (ymin_max + ymin_min) / 2
          for i in idx:
            if ymins[i] < ymin_avr:
              p1 = np.append(p1, characters[i])
            else:
              p2 = np.append(p2, characters[i])

        print(f'phan 1: {p1}, phan 2: {p2}')
      except Exception as e:
        print(e)
        break
    else:
      sleep(1)

def Streaming(streaming_server):
  try:
    streaming_server.serve_forever()
    print('Stop streaming!')
  except Exception as e:
    print(e)

def run(threshold1, threshold2):

  PICAM2.post_callback = draw_bound
  PICAM2.configure(PICAM2.create_video_configuration(main={"size": cvc.CAM_SIZE, 'format': 'RGB888'}))
  PICAM2.start_recording(JpegEncoder(), FileOutput(stream1))

  t1 = Thread(target=Streaming, args=(streaming_server,))
  t2 = Thread(target=Process_image, args=(threshold1, threshold2))
  t1.start()
  t2.start()
  
  while True:
    i = input()
    if (i == 'q'):
      cvc.QUIT_SIGNAL = True
      streaming_server.shutdown()
      break
    elif (i == 'p'):
      cvc.REQUEST = True
    elif (i == 's'):
      cvc.REQUEST = False
  
  t1.join()
  t2.join()
  PICAM2.stop_recording()

if __name__ == '__main__':
  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument(
    '--model1',
    help='Path of license plate detection model.',
    required=True
  )
  parser.add_argument(
    '--model2',
    help='Path of license plate recognition model.',
    required=True
  )
  parser.add_argument(
    '--threshold1',
    help='Threshold of detection score.',
    type=float,
    required=True
  )
  parser.add_argument(
    '--threshold2',
    help='Threshold of recognition score.',
    type=float,
    required=True
  )
  parser.add_argument(
    '--label',
    help='Path of label file.',
    required=True
  )
  args = parser.parse_args()

  with open(args.label, 'r') as f:
    LABELS = np.array([line.strip() for line in f], str)
  LP_DETECTION = LP_Detection(args.model1 , cvc.FOCUS_SIZE)
  LP_OCR = LP_Ocr(args.model2, LABELS, cvc.FOCUS_SIZE)
  
  PICAM2 = Picamera2()

  run(args.threshold1, args.threshold2)
# python test.py --model1 models/lp_detection_model.tflite --model2 models/lpcharacters_detection_lite0_model.tflite --threshold1 0.8 --threshold2 0.3 --label models/labelmap.txt
