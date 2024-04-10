import os
import pickle
import cv2

alphanumeric = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

def check(dir, index):

  wrong_lines = []
  all_lines = []
  all_lines_count = 0
  cv2.namedWindow('Checking')
  cv2.moveWindow('Checking', 500, 300)

  with open(f'{dir}/{dir}.csv', 'r') as csvfile:
    for line in csvfile:
      line = line.strip()
      if (line):
        all_lines.append(line)
    all_lines_count = len(all_lines)

    if (index < 0 or index > len(all_lines)-1):
      print('invalid index')
      cv2.destroyAllWindows()
      return
    
    while True:
      current_line = all_lines[index]
      _, filepath, label_idx, xmin, ymin, _, _, xmax, ymax, _, _ = current_line.split(',')

      img_filename = os.path.basename(filepath)
      img_filepath = os.path.join(dir, img_filename)

      image = cv2.imread(img_filepath)
      if image is None:
        print('error at line: ', index+1)
        return
      
      img_height, img_width, _ = image.shape
      xmin = int(float(xmin)*img_width)
      ymin = int(float(ymin)*img_height)
      xmax = int(float(xmax)*img_width)
      ymax = int(float(ymax)*img_height)

      label = alphanumeric[int(label_idx)]

      image = cv2.putText(image, str(index), (0, 30), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255))
      image = cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 0, 255), 1)
      image = cv2.putText(image, label, (xmin, ymin+30), cv2.FONT_HERSHEY_COMPLEX, 1, (0,0,255))
      cv2.imshow('Checking', image)

      key = cv2.waitKey()
      if (key == 110):  # N key
        index = (index+1)%all_lines_count
      elif (key == 98): # B key
        if (index == 0):
          index = all_lines_count-1
        else:
          index = (index-1)%all_lines_count
      elif (key == 119):  # W key
        print('Wrong line: ', f'{dir}/{dir}.csv', index+1)
      elif (key == 27): # ESC key
        print('Stop at index: ', index)
        with open('cache/lastIdx.pkl', 'wb') as f:
          pickle.dump(index, f)
        cv2.destroyAllWindows()
        return

if __name__ == '__main__':
  try:
    with open('cache/lastIdx.pkl', 'rb') as f:
      index = pickle.load(f)
  except:
    index = 0
  directory = input('Enter directory name of dataset: ').strip() or 'lb_characters_dataset'
  index = int(input('Enter the index file you want to start: ').strip() or str(index))
  check(directory, index)
  #727
