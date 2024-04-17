import csv
import argparse
from pathlib import Path

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
  with open(f'{filename}_summarize.txt', 'w') as output:
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
  with open(filepath, 'r') as input, open(f'{filename}_assigned.csv', 'w', newline='') as output:
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
  parser.add_argument('path', help='Path of csv file.')
  args = parser.parse_args()
  assign_datatype(args.path)

if __name__ == '__main__':
  main()