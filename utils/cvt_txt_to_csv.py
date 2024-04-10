import os
import csv

def convert_txt_to_csv(dataset_dir):
  train_dir = '/content'

  index = 0
  data_type = img_path = label = ''
  xmin = xmax = ymin = ymax = 0

  with open(f'{dataset_dir}/lb_characters_dataset.csv', 'w', newline='') as output:
    writer = csv.writer(output)

    for file in os.listdir(dataset_dir):
      file_dir = os.path.join(dataset_dir, file)
      if file.endswith('txt'):
        txt_filename, _ = os.path.splitext(file)
        img_filename = txt_filename+'.jpg'
        img_path = f'{train_dir}/{dataset_dir}/{img_filename}'

        if (index < 1826):
          data_type = 'TRAIN'
        elif (index < 2054):
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

if __name__ == '__main__':
  convert_txt_to_csv('lb_characters_dataset')
