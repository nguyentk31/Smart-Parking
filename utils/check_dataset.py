import os
import pickle
from pathlib import Path
import cv2
import argparse
import numpy as np

# Read csv file and save all line to all_lines array
def readAll(filepath):
  all_lines = []
  with open(filepath, 'r') as csvfile:
    for line in csvfile:
      line = line.strip()
      if (line):
        all_lines.append(line)
  return all_lines

# Read csv file but save specific label(s) line to labeled_lines array with index
def readLabeled(filepath, labels):
  labeled_lines = []
  real_index = []
  with open(filepath, 'r') as csvfile:
    for idx, line in enumerate(csvfile):
      line = line.strip()
      if (line):
        _, _, label, _, _, _, _, _, _, _, _ = line.split(',')
        if (label in labels):
          labeled_lines.append(line)
          real_index.append(idx)
  return labeled_lines, real_index

def check(filepath: str, index: int, labels: list, nolabel: bool):
  cv2.namedWindow('Checking')
  cv2.moveWindow('Checking', 500, 300)

  # check if labels is specified
  # if not read all line
  if (len(labels) == 0):
    lines = readAll(filepath)
  # if true read specific labels line
  else:
    lines, real_index = readLabeled(filepath, labels)
  # count lines to show
  count = len(lines)

  # check if index is valid
  if (index < 0 or index > count-1):
    print('invalid line')
    cv2.destroyAllWindows()
    return
  
  # Loop read lines
  while True:
    current_line = lines[index]
    _, img_path, label, xmin, ymin, _, _, xmax, ymax, _, _ = current_line.split(',')

    if (len(labels) > 0 and label not in labels):
      index = (index+1)%count
      continue

    image = cv2.imread(img_path)
    if image is None:
      print('error at line: ', index+1)
      return
    
    img_height, img_width, _ = image.shape
    xmin = int(float(xmin)*img_width)
    ymin = int(float(ymin)*img_height)
    xmax = int(float(xmax)*img_width)
    ymax = int(float(ymax)*img_height)

    # draw rectangle and the index to image
    image = cv2.putText(image, str(index+1), (0, 30), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255))
    image = cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (255, 0, 0), 2)

    # if nolabel flag is set, don't show label on image
    if (not nolabel):
      image = cv2.putText(image, label, (xmin, ymin+30), cv2.FONT_HERSHEY_COMPLEX, 2, (0,0,255), 3)

    # Show image
    cv2.imshow('Checking', image)

    # Read key
    key = cv2.waitKey()
    # N key -> Next line
    if (key == 110):  # N key
      index = (index+1)%count
    # B(ack) key -> Previous line
    elif (key == 98): # B key
      if (index == 0):
        index = count-1
      else:
        index = (index-1)%count
    # W(rong) key -> print filepath and line number to terminal 
    elif (key == 119):  # W key
      if (len(labels) == 0):
        print('Wrong line: ', filepath, index+1)
      else:
        print('Wrong line: ', filepath, real_index[index]+1)
    # ESC(ape) key -> Exit
    elif (key == 27): # ESC key
      print('Stop at line: ', index+1)
      if (len(labels) == 0):
        # Save the lastest read line index to the next time
        with open(f'.cache/{Path(filepath).stem}_idx.pkl', 'wb') as f:
          pickle.dump(index, f)
      cv2.destroyAllWindows()
      return
    # R(eset) key -> Re-read csv file (new file after modified)
    elif (key == 114): # R key
      if (len(labels) == 0):
        lines = readAll(filepath)
      else:
        lines = readLabeled(filepath, labels)
      count = len(lines)
      index = index if index < count else count

def main():
  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument(
    'filepath',
    help='Path of csv file.')
  parser.add_argument(
    '--line',
    help='Line number you want to start.',
    required=False,
    type=int,
    default=0)
  parser.add_argument(
    '--labels',
    help='check specific labels.',
    nargs='+',
    required=False,
    default=[])
  parser.add_argument(
    '-nolabel',
    help='If you don\'t want to show label.',
    action='store_true')
  args = parser.parse_args()

  args.filepath, args.line, args.labels, args.nolabel

  if (len(args.labels) > 0):
    index = 0 if args.line == 0 else args.line-1
  else:
    if (args.line != 0):
      index = args.line-1
    else:
      try:
        # Read cach file save the lastest read line index
        with open(f'.cache/{Path(args.filepath).stem}_idx.pkl', 'rb') as f:
          index = pickle.load(f) if args.line == 0 else 0
      except:
        index = 0
  check(args.filepath, index, args.labels, args.nolabel)

if __name__ == '__main__':
  main()
