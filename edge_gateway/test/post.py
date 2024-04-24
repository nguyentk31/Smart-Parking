import cv2
import requests

def post_data(API, image, direction, lisence_plate):
  image_byte = cv2.imencode('.jpg', image)[1].tobytes()
  files = {'log': ('image.jpg', image_byte, 'image/jpg')}
  data = {
    'direction': direction,
    'lp_part1': lisence_plate[0],
    'lp_part2': lisence_plate[1]
  }
  try:
    rsp = requests.post(API, data=data, files=files)
  except Exception as e:
    print('Error:')
    print(e)
  else:
    print(rsp.text)

if __name__ == '__main__':
  API = 'http://localhost:8800/data'
  image = cv2.imread('lp_dataset/0000_00532_b.jpg')
  direction = 'in'
  lisence_plate = ['34T2', '36354']
  post_data(API, image, direction, lisence_plate)