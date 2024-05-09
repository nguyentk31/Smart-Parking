import numpy as np

DIRECTION = 'in'
GW_API = 'http://DESKTOP-B3JQ5UH:8800/api/parking/'
MQTT_BROKER = 'DESKTOP-B3JQ5UH'
MQTT_PORT = 1883
MQTT_USERNAME = 'iot'
MQTT_PASSWORD = '123456'
MQTT_SUB = 'parking_gate'

FOCUS_SIZE = np.array((320, 320))
CAM_SIZE = np.array((640, 480))
PROCESS_ORG_COOR = (CAM_SIZE-FOCUS_SIZE)//2
PROCESS_RECT = np.append(PROCESS_ORG_COOR, PROCESS_ORG_COOR+FOCUS_SIZE)

LP_DETECTION_MODEL_PATH = 'models/lp_detection_model.tflite'
LP_OCR_MODEL_PATH = 'models/lpcharacters_detection_lite2_model.tflite'
LABEL_FILEPATH = 'models/labelmap.txt'

STREAMING_SERVER_INFO = {
  'address': ('', 8000)
}
