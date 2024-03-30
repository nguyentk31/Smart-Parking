# Checking bounding boxes in csv file
import csv
import cv2

def border_box(dataset_dir, csv_file, start_line):
  # Open file csv
  with open(csv_file, newline='') as csvfile:
    cv2.namedWindow('Checking')
    cv2.moveWindow('Checking', 500, 300)
    text_pos = (0, 20)  # where order number of line print
    wrong_lines = [] # The order number of wrong lines

    spamreader = csv.reader(csvfile, delimiter=',')
    for idx, row in enumerate(spamreader):
      # skip till the start_line
      if (idx+1 < start_line):
        continue

      imageURL = f'{dataset_dir}/{row[1]}'
      image = cv2.imread(imageURL)
      if image is not None:
        img_height, img_width, _ = image.shape
      
      # Rectangle position
      start_point = [int(float(row[3])*img_width), int(float(row[4])*img_height)]
      end_point = [int(float(row[7])*img_width), int(float(row[8])*img_height)]

      # draw image
      image = cv2.rectangle(image, start_point, end_point, (0, 0, 255), 1)
      image = cv2.putText(image, str(idx+1), text_pos, cv2.FONT_HERSHEY_COMPLEX, 0.9, (255,255,255))
      cv2.imshow('Checking', image)

      # N key: next img, W key: write to wrong_lines, else: exit
      key = cv2.waitKey(0)
      if key == 110: # N key
        continue
      elif key == 119: # W key
        wrong_lines.append(idx)
      else:
        break
      
  cv2.destroyAllWindows()


if __name__ == '__main__':
  # Enter the line to start
  start_line = int(input('Enter start line: '))
  border_box('dataset', 'location.csv', start_line)