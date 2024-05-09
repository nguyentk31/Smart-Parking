import numpy as np
import cv2
import requests
import utils.common_vars_consts as cvc
from utils.LP_Recognition import LP_Detection, LP_Ocr

LP_DETECTION = LP_Detection(cvc.LP_DETECTION_MODEL_PATH)
LP_OCR = LP_Ocr(cvc.LP_OCR_MODEL_PATH, cvc.LABEL_FILEPATH)

# License plate detection function
def detect_lp(image, threshold):
  # Crop image to focus size then run detection model
  process_image = image[cvc.PROCESS_RECT[1]: cvc.PROCESS_RECT[3],cvc.PROCESS_RECT[0]:cvc.PROCESS_RECT[2]]
  result = LP_DETECTION.detect(process_image, threshold)

  if result is None:
    return None
  
  # Calculate center coordinate of license plate and crop squares image around licence plate
  bbox, score = result
  (org_xmin, org_ymin, org_xmax, org_ymax) = bbox + np.tile(cvc.PROCESS_ORG_COOR, 2)
  ctx = (org_xmin + org_xmax) // 2 
  cty = (org_ymin + org_ymax) // 2
  d = max((org_xmax-org_xmin)//2, (org_ymax-org_ymin)//2)
  squares_xmin, squares_xmax, squares_ymin, squares_ymax = ctx - d, ctx + d, cty - d, cty + d
  try:
    # Crop license plate image to run ocr model
    plate_image = image[squares_ymin:squares_ymax, squares_xmin:squares_xmax]
  except Exception as e:
    print(e)
    print('plate image coordinates invalid!')
    return None
  finally:
    return plate_image, score

# License plate OCR
def ocr_lp(plate_image, threshold):
  _, bboxes, characters = LP_OCR.Ocr(plate_image, threshold)

  # If ocr characters is too less then drop result
  if (len(characters) < 7):
    print(characters)
    return None

  # Get order of characters from left to right
  xmins = bboxes[:, 0]
  idx = np.argsort(xmins)

  ymins = bboxes[:, 1]
  ymaxs = bboxes[:, 3]
  characters_heights_min = np.min(ymaxs-ymins)
  ymin_min = np.min(ymins)
  ymin_max = np.max(ymins)
  # If the distance between ymin_max and ymin_min > character_height_min,
  # then it would be 2 line license plate. if not, it would be 1 line license plate
  p1 = ''
  p2 = ''
  if (ymin_max - ymin_min < characters_heights_min):
      line = characters[idx]
      p1 = ''.join(line[0:3])
      p2 = ''.join(line[3:])
  else:
    ymin_avr = (ymin_max + ymin_min) / 2
    for i in idx:
      if ymins[i] < ymin_avr:
        p1 += characters[i]
      else:
        p2 += characters[i]

  # return 2 part of license plate
  return (p1, p2)

def post_data(image, data):
  image_byte = cv2.imencode('.jpg', image)[1].tobytes()
  files = {'log': ('image.jpg', image_byte, 'image/jpg')}
  try:
    rsp = requests.post(cvc.GW_API, data=data, files=files)
  except Exception as e:
    print('Error:')
    print(e)
  else:
    print(rsp.text)