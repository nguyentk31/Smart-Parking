import xml.etree.ElementTree as ET
import os
import csv

# Convert xml annotation files to dataset csv file
def convert_xml_to_csv(dataset_dir):

  # directory on colab
  train_dir = '/content'
  data_type = ''
  index = 0
  check = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  err = []
  with open(f'{dataset_dir}/dataset2.csv', 'w', newline='') as output:
    writer = csv.writer(output)

    for file in os.listdir(dataset_dir):
      f_in = os.path.join(dataset_dir, file)
      if file.endswith(".xml"):
        root = ET.parse(f_in).getroot()
        filename = root.find('filename').text
        size = root.find('size')
        img_width = int(size[0].text)
        img_height = int(size[1].text)

        if (index < 200):
          data_type = 'TRAIN'
        elif (index < 225):
          data_type = 'VALIDATION'
        else:
          data_type = 'TEST'
        index += 1

        for obj in root.iter('object'):
          name = obj[0].text
          if (name not in check):
            err.append(f'{file}, name')
          bbox = obj[4]
          xmin = int(bbox[0].text)/img_width
          ymin = int(bbox[1].text)/img_height
          xmax = int(bbox[2].text)/img_width
          ymax = int(bbox[3].text)/img_height

          writer.writerow([data_type, f'{train_dir}/dataset2_processed/{filename}', name, xmin, ymin, '', '', xmax, ymax, '', ''])

          
  print(err)
if __name__ == '__main__':
  convert_xml_to_csv('dataset2')
