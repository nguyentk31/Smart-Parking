import os

def removeFile(extension, dataset_dir):
  err = 0
  for file in os.listdir(dataset_dir):
    if file.endswith(extension):
      f_in = os.path.join(dataset_dir, file)
      if os.path.exists(f_in):
        os.remove(f_in)
      else:
        err += 1
  print(err)


if __name__ == '__main__':
  removeFile('xml', '../process_dataset2')