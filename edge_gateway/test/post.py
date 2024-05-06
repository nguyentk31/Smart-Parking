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
    if direction == 'in':
      API += 'createParking'
      rsp = requests.post(API, data=data, files=files)
    else:
      API += 'updateParkingCheckOut'
      rsp = requests.patch(API, data=data, files=files)
  except Exception as e:
    print('Error:')
    print(e)
  else:
    print(rsp.text)

if __name__ == '__main__':
  API_SERVER = 'http://localhost:3000/api/parking/'
  image = cv2.imread('lp_dataset/carrr.jpg')
  direction = 'out'
  lisence_plate = ['51A', '13883']
  post_data(API_SERVER, image, direction, lisence_plate)