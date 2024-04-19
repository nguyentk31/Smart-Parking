import cv2
import requests

def post_data(API, image, data):
  image_byte = cv2.imencode('.jpg', image)[1].tobytes()
  files = {'log': ('image.jpg', image_byte, 'image/jpg')}
  body = {
    'message': 'recognized license-plate',
    'data': data
  }
  try:
    rsp = requests.post(API, data=body, files=files)
  except Exception as e:
    print('Error:')
    print(e)
  else:
    print(rsp.text)

if __name__ == '__main__':
  API = 'http://localhost:8800/data'
  image = cv2.imread('lp_dataset/0000_00532_b.jpg')
  post_data(API, image, {'what': 'anything'})