import os

def removeFile(extension, directory):
  for file in os.listdir(directory):
    if file.endswith(extension):
      f_in = os.path.join(directory, file)
      os.remove(f_in)
  print('done')


if __name__ == '__main__':
  directory = input('Enter directory: ')
  extension = input('Enter the extension of files you wanna remove: ')
  removeFile(extension, directory)