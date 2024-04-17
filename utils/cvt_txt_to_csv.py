import os
import csv
import argparse
from pathlib import Path

# Convert location txt file to csv file
def convert_txt_to_csv(dataset_dir):
  # Read directory name
  dir_name = os.path.basename(dataset_dir)
  
  # info to write csv file
  img_path = label = ''
  xmin = xmax = ymin = ymax = 0

  # write new csv file to csvfiles directory
  with open(f'csvfiles/{dir_name}.csv', 'w', newline='') as output:
    writer = csv.writer(output)

    # Read each txt file in directory
    for file in os.listdir(dataset_dir):
      file_dir = os.path.join(dataset_dir, file)
      if file.endswith('txt'):
        txt_filename, _ = os.path.splitext(file)
        # save image file path
        img_filename = txt_filename+'.jpg'
        img_path = f'{dataset_dir}/{img_filename}'

        # Read each line in txt file
        with open(file_dir, 'r') as input:
          for line in input:
            line = line.strip()
            if (line):
              label, centerx, centery, w, h = line.split()

              # limit the coordinate value to the range [0,1]
              xmin = 0 if (float(centerx)-float(w)/2) < 0 else (float(centerx)-float(w)/2)
              ymin = 0 if (float(centery)-float(h)/2) < 0 else (float(centery)-float(h)/2)
              xmax = 1 if (float(centerx)+float(w)/2) > 1 else (float(centerx)+float(w)/2)
              ymax = 1 if (float(centery)+float(h)/2) > 1 else (float(centery)+float(h)/2)

              # write new row to csv file without datatype
              writer.writerow(['', img_path, label, xmin, ymin, '', '', xmax, ymax, '', ''])

  # Assign datatype to the newly created csvfile
  assign_datatype(f'csvfiles/{dir_name}.csv')

# Summarize all labels
def summarize_labels(filepath):
  # Get name of csv file
  filename = Path(filepath).stem
  labels = {}
  # Read csv file and save total numbers
  with open(filepath, 'r', newline='') as input:
    reader = csv.reader(input)
    for row in reader:
      if (row[2] not in labels.keys()):
        labels[row[2]] = {'total': 1, 'index': 0}
      else:
        labels[row[2]]['total'] += 1

  # 80% TRAIN, 10% VALIDATION, 10% TEST, save summarize to txt file
  with open(f'csvfiles/{filename}_summarize.txt', 'w') as output:
    for label in labels.keys():
      total = labels[label]['total']
      labels[label]['train'] = round(total*0.8)
      labels[label]['validation'] = round(total*0.1)
      output.writelines(f'label: {label}, total: {total}, train: {labels[label]["train"]}, validation: {labels[label]["validation"]}, test: {total - (labels[label]["train"] + labels[label]["validation"])}\n')
  return labels


# Assign datatype to data
def assign_datatype(filepath):
  filename = Path(filepath).stem
  # summarize to count train, validation, test datatype number
  labels = summarize_labels(filepath)

  # write result to csv file _assigned
  with open(filepath, 'r') as input, open(f'csvfiles/{filename}_assigned.csv', 'w', newline='') as output:
    reader = csv.reader(input)
    writer = csv.writer(output)
    for row in reader:
      label = row[2]
      index = labels[label]['index']
      if index < labels[label]['train']:
        data_type = 'TRAIN'
      elif index < (labels[label]['train'] + labels[label]['validation']):
        data_type = 'VALIDATION'
      else:
        data_type = 'TEST'
      labels[label]['index'] += 1

      # Write new row to csv file
      writer.writerow([data_type, row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10]])

def main():
  # Parse csv file path
  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('path', help='Path to dataset.')
  args = parser.parse_args()

  dir = args.path.replace('\\', '/') # replace \ -> /
  f_arr = [f for f in dir.split('/') if f] # only directory
  dir = '/'.join(f_arr)

  convert_txt_to_csv(dir)

if __name__ == '__main__':
  main()
  
