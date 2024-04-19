import random
import numpy as np

FOCUS_SIZE = np.array((320, 320))
CAM_SIZE = np.array((640, 480))
PROCESS_ORG_COOR = (CAM_SIZE-FOCUS_SIZE)//2
PROCESS_RECT = np.append(PROCESS_ORG_COOR, PROCESS_ORG_COOR+FOCUS_SIZE)

LP_DETECTION_MODEL_PATH = 'models/lp_detection_model.tflite'
LP_OCR_MODEL_PATH = 'models/lpcharacters_detection_lite0_model.tflite'
LABEL_FILEPATH = 'models/labelmap.txt'

MQTT_INFO = {
  'broker': 'DESKTOP-B3JQ5UH',
  'port': 1883,
  # 'pub_topic': 'iot/recognize',
  'subc_topic': 'iot/request',
  'client_id': f'python-mqtt-{random.randint(0, 1000)}',
  'username': 'iot',
  'password': '123456'
}

STREAMING_SERVER_INFO = {
  'address': ('', 8000)
}