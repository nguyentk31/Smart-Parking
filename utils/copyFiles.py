import os
import shutil

def copyFiles(src_dir, dest_dir):
  count = 0
  for file in os.listdir(src_dir):
    if 'xemay' in file or 'CarLongPlate' in file:
      count+=1
      shutil.copyfile(os.path.join(src_dir, file), os.path.join(dest_dir, file))
  print(count)

if __name__ == '__main__':
  src_dir = 'yolo_plate_ocr_dataset'
  dest_dir = 'lp_characters_dataset'
  copyFiles(src_dir, dest_dir)