import os
import pickle
import cv2
import argparse

alphanumeric        = ['0',  '1',  '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',  'A',   'B',   'C',   'D',   'E',   'F',   'G',   'H',   'I',   'J',   'K',   'L',   'M',   'N',   'O',   'P',   'Q',   'R',   'S',   'T',   'U',   'V',   'W',   'X',   'Y',   'Z']
alphanumeric_index  = ['0',  '1',  '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',  '10',  '11',  '12',  '13',  '14',  '15',  '16',  '17',  '18',  '19',  '20',  '21',  '22',  '23',  '24',  '25',  '26',  '27',  '28',  '29',  '30',  '31',  '32',  '33',  '34',  '35']

def check(dir: str, index: int, nolabel: bool):

  dir_name = os.path.basename(dir)
  all_lines = []
  all_lines_count = 0
  cv2.namedWindow('Checking')
  cv2.moveWindow('Checking', 500, 300)

  with open(f'{dir}/{dir_name}.csv', 'r') as csvfile:
    for line in csvfile:
      line = line.strip()
      if (line):
        all_lines.append(line)
    all_lines_count = len(all_lines)

    if (index < 0 or index > all_lines_count-1):
      print('invalid line')
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

      image = cv2.putText(image, str(index+1), (0, 30), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255))
      image = cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (255, 0, 0), 2)

      if (not nolabel):
        label = alphanumeric[int(label_idx)]
        image = cv2.putText(image, label, (xmin, ymin+30), cv2.FONT_HERSHEY_COMPLEX, 2, (0,0,255), 3)

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
        print('Stop at line: ', index+1)
        with open(f'.cache/{dir_name}_idx.pkl', 'wb') as f:
          pickle.dump(index, f)
        cv2.destroyAllWindows()
        return
      elif (key == 114): # R key
        csvfile.seek(0)
        all_lines.clear()
        for line in csvfile:
          line = line.strip()
          if (line):
            all_lines.append(line)
        all_lines_count = len(all_lines)
        index = index if index < all_lines_count else all_lines_count

def main(dir: str, line: int, nolabel: bool):

  dir = dir.replace('\\', '/') # replace \ -> /
  f_arr = [f for f in dir.split('/') if f] # only directory
  dir = '/'.join(f_arr)

  if (line == 0):
    try:
      with open(f'.cache/{os.path.basename(dir)}_idx.pkl', 'rb') as f:
        index = pickle.load(f)
    except:
      index = 1
  else:
    index = line-1

  check(dir, index, nolabel)


if __name__ == '__main__':

  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument(
      '--path',
      help='Path of directory name of dataset.',
      required=True)
  parser.add_argument(
      '--line',
      help='Line number you want to start.',
      required=False,
      type=int,
      default=0)
  parser.add_argument(
      '-nolabel',
      help='If you don\'t want to show label.',
      action='store_true')
  args = parser.parse_args()

  main(args.path, args.line, args.nolabel)
