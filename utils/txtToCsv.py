import os
import cv2
import csv

# Convert txt location file to dataset csv file
def convert_txt_to_csv(locationfile):
  
  dataset_dir = 'dataset'
  # directory on colab
  train_dir = '/content'

 # Read each line in txt file and write csv file
  with open(locationfile, 'r') as input, open(f'{dataset_dir}/dataset.csv', 'w', newline='') as output:
    writer = csv.writer(output)
    for index, line in enumerate(input):
      # Set dataset type
      data_type = ''
      if (index < 1400):
        data_type = 'TRAIN'
      elif (index < 1600):
        data_type = 'VALIDATION'
      else:
        data_type = 'TEST'
      
      # Read line
      imageURL, label, x, y, width, height = line.split()
      image = cv2.imread(f'{dataset_dir}/{imageURL}')
      if image is not None:
        img_height, img_width, _ = image.shape
      
        # Calculate and write a row of file csv
        x, y, width, height = int(x), int(y), int(width), int(height)
        xMin, yMin, xMax, yMax = x/img_width, y/img_height, (x+width)/img_width, (y+height)/img_height
        writer.writerow([data_type, f'{train_dir}/{dataset_dir}/{imageURL}', label, xMin, yMin, '', '', xMax, yMax, '', ''])

if __name__ == '__main__':
  convert_txt_to_csv('./location.txt')
