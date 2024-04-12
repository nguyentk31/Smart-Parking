import os
import argparse
import shutil

def copyFiles(src_dir, dest_dir, files):
  count = 0
  for f in os.listdir(src_dir):
    if (any(file in f for file in files)):
      count+=1
      shutil.copyfile(os.path.join(src_dir, f), os.path.join(dest_dir, f))
  print(count)

def main(src, dest, files):
  src_dir = src.replace('\\', '/') # replace \ -> /
  f_arr = [f for f in dir.split('/') if f] # only directory
  src_dir = '/'.join(f_arr)

  dest_dir = dest.replace('\\', '/') # replace \ -> /
  f_arr = [f for f in dir.split('/') if f] # only directory
  dest_dir = '/'.join(f_arr)

  copyFiles(src_dir, dest_dir, files)

if __name__ == '__main__':
  parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument(
      '--src',
      help='Source.',
      required=True)
  parser.add_argument(
      '--dest',
      help='Destination.',
      required=True)
  parser.add_argument(
      'files',
      help='Files you want to copy.',
      nargs='+')
  args = parser.parse_args()
  copyFiles(args.src, args.dest, args.files)