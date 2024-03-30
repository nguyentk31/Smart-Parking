import os
import cv2
import csv

# Convert txt location file to csv file
def convert_txt_to_csv(filepath):
  # Read file name and change to new extension
  filename, _ = os.path.splitext(filepath)
  csv_filename = f'{filename}.csv'

 # Read each line in txt file and write csv file
  with open(filepath, 'r') as input, open(csv_filename, 'w', newline='') as output:
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
      image = cv2.imread(f'dataset/{imageURL}')
      if image is not None:
        img_height, img_width, _ = image.shape
      
        # Calculate and write a row of file csv
        x, y, width, height = int(x), int(y), int(width), int(height)
        xMin, yMin, xMax, yMax = x/img_width, y/img_height, (x+width)/img_width, (y+height)/img_height
        writer.writerow([data_type, imageURL, label, xMin, yMin, '', '', xMax, yMax, '', ''])

# Example usage
if __name__ == '__main__':
  convert_txt_to_csv('./location.txt')
