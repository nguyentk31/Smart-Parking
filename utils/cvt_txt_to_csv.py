import os
import csv
import argparse

def convert_txt_to_csv(dataset_dir):

  dir_name = os.path.basename(dataset_dir)
  
  index = 0
  data_type = img_path = label = ''
  xmin = xmax = ymin = ymax = 0

  with open(f'{dataset_dir}/{dir_name}.csv', 'w', newline='') as output:
    writer = csv.writer(output)
    img_count = int(len(os.listdir(dataset_dir))/2)
    train_img_count = int(img_count*0.8)
    validation_img_count = int(img_count*0.9)

    for file in os.listdir(dataset_dir):
      file_dir = os.path.join(dataset_dir, file)
      if file.endswith('txt'):
        txt_filename, _ = os.path.splitext(file)
        img_filename = txt_filename+'.jpg'
        img_path = f'{dataset_dir}/{img_filename}'

        if (index < train_img_count):
          data_type = 'TRAIN'
        elif (index < validation_img_count):
          data_type = 'VALIDATION'
        else:
          data_type = 'TEST'
        index += 1

        with open(file_dir, 'r') as input:
          for line in input:
            line = line.strip()
            if (line):
              label, centerx, centery, w, h = line.split()

              xmin = float(centerx) - float(w)/2
              ymin = float(centery) - float(h)/2
              xmax = float(centerx) + float(w)/2
              ymax = float(centery) + float(h)/2

              writer.writerow([data_type, img_path, label, xmin, ymin, '', '', xmax, ymax, '', ''])

def main(path: str):
  dir = path.replace('\\', '/') # replace \ -> /
  f_arr = [f for f in dir.split('/') if f] # only directory
  dir = '/'.join(f_arr)
  convert_txt_to_csv(dir)

if __name__ == '__main__':
  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('path', help='Path to dataset.')
  args = parser.parse_args()
  main(args.path)
